# MongoDB Database Explanation

This document explains how CodeBuddy saves data using MongoDB. You can use this to explain the database setup to your teacher.

## What is MongoDB?

Instead of saving data in tables with rows and columns (like a spreadsheet or a SQL database), MongoDB saves data as **JSON objects** (called documents). Since we are using JavaScript, saving data as JSON objects is incredibly natural because they look exactly like regular JavaScript objects!

We are using **MongoDB Atlas**, which is a version of MongoDB that lives in the cloud, so we don't have to install the database locally on our computers.

## The Connection Structure (`src/lib/mongo.server.ts`)

Instead of writing connection code every single time we want to save or read data, the code has a central hub for database actions.

### 1. `getMongoClient()`

**What it does:** It connects our app to the cloud database.
**How it works:** It looks at a secret file (`.env`) to find the `MONGO_URI` (the web address and password for the cloud database). It creates a connection once, and then **caches** it (saves it in a variable) so that if 10 students visit the site at the same time, it reuses the same connection instead of creating 10 new ones and slowing down the app.

### 2. `mongoRequest(collectionName, action, body)`

**What it does:** This is a "wrapper" or "helper" function. It handles all our database commands in one place.
**How it works:** In MongoDB, data is grouped into "Collections" (like folders). We have collections for `users`, `topics`, `days`, and `files`.
This function takes the collection name, what we want to do (`action`), and any data (`body`). It uses a JavaScript `switch` statement to run the correct MongoDB command:

- **`find` / `findOne`**: Searches the database. `find` gets all matches (like getting all files for a specific day), while `findOne` gets just the first match (like finding a specific user when they log in).
- **`insertOne`**: Adds a brand new JavaScript object into the database. We use this when a teacher creates a new Day or adds a new Code File.
- **`updateOne`**: Modifies an existing object. We use this if we need to rename a file or update the teacher's password.
- **`deleteOne` / `deleteMany`**: Removes data. When you delete a Topic, it uses `deleteMany` to also clean up and delete all the Days and Files inside that topic so we don't leave trash in the database.

## How the Frontend talks to the Database (`src/lib/store.ts`)

The `store.ts` file acts as the middleman. When the frontend (HTML/UI) wants a list of categories or days, it calls an API function in `store.ts` (like `api.listTopics()`).

This API function then talks to `mongoRequest()`, gets the data out of the database, and sorts it nicely before handing it back to the frontend to display!

---

## Real-World Example: Adding a Lesson

Let's trace exactly what happens under the hood when a teacher wants to upload a new lesson. Imagine the teacher creates a new **Topic**, adds a **Day** to it, and then uploads **2 Code Files** (like `index.html` and `style.css`).

Here is the exact step-by-step chain reaction of where it is called and how it works:

### Step 1: Creating the Topic (`src/lib/store.ts`)

The teacher clicks "Create Topic" on the frontend screen. The frontend HTML triggers `api.createTopic()`. The code generates a unique ID, builds a JSON object, and calls `mongoRequest` with `"insertOne"`.

```javascript
// Inside src/lib/store.ts
async createTopic(input) {
  const t = {
    id: uid("t"), // Generates random ID like t-abc123
    categoryId: input.categoryId,
    title: input.title,
  
    // JS CONCEPT: 'slugify' is a helper function that takes a title 
    // with spaces and capital letters (e.g. "My Cool Lesson") and 
    // turns it into a web-safe URL string (e.g. "my-cool-lesson")
    slug: slugify(input.title), 
  
    createdAt: now(),
    updatedAt: now(),
  };

  // Talks to MongoDB helper to insert it!
  await runMongoOp({
    data: { token: getToken(), collection: "topics", action: "insertOne", body: { document: t } },
  });
  return t;
}
```

### Step 2: Creating the Day

Next, the teacher clicks "Add Day". The frontend calls `api.createDay()`.
Notice how the new Day object includes a `topicId` property. This is how MongoDB knows which Topic this Day belongs to!

```javascript
// Inside src/lib/store.ts
async createDay(input) {
  // First, find the current highest day number...
  let nextNumber = 1;
  // ... (code omitted for brevity) ...

  const d = {
    id: uid("d"),
    // JS CONCEPT: This links perfectly back to the Topic we just created!
    // This is called a "Foreign Key" relationship in databases.
    topicId: input.topicId, 
  
    dayNumber: nextNumber,
    title: input.title,
    createdAt: now(),
    updatedAt: now(),
  };

  await runMongoOp({
    data: { token, collection: "days", action: "insertOne", body: { document: d } },
  });

  return d;
}
```

### Step 3: Uploading 2 Code Files

The teacher pastes the code for `index.html` and `style.css` and clicks Save.
The frontend calls `api.createFile()` for the first file (`index.html`).

```javascript
// Inside src/lib/store.ts
async createFile(input) {
  const f = {
    // JS CONCEPT: The "..." is the modern JavaScript Spread Operator.
    // Instead of manually typing out input.content, input.language, etc.
    // this instantly dumps all properties from the 'input' variable into this new object!
    ...input, 
  
    id: uid("f"),
    displayOrder: order,
  };

  // Insert the file into the database
  await runMongoOp({
    data: { token, collection: "files", action: "insertOne", body: { document: f } },
  });
  
  // BONUS: Update the parent Day to show it was recently modified!
  await runMongoOp({
    data: {
      token,
      collection: "days",
      action: "updateOne",
      body: { filter: { id: input.dayId }, update: { $set: { updatedAt: now() } } },
    },
  });

  return f;
}
```

The process then instantly repeats itself, running the exact same `api.createFile()` code snippet for `style.css`.

### Summary of the Data Structure

After this single quick interaction, our database now holds a neatly connected tree:

- **1 Topic Object** (inside `topics` collection)
  - **1 Day Object** (inside `days` collection, linked by `topicId`)
    - **File 1 Object** (`index.html`, inside `files` collection, linked by `dayId`)
    - **File 2 Object** (`style.css`, inside `files` collection, linked by `dayId`)

Because MongoDB is so fast with JSON objects, this entire chain reaction of reading, writing, and updating takes less than a fraction of a second!

---

## How Images and Zip Files are Stored (Assets)

CodeBuddy also supports uploading binary files like Images (`.png`, `.jpg`) and Archives (`.zip`). Instead of needing a separate file storage service (like AWS S3), we store these directly inside MongoDB!

### 1. Converting to Base64
When the teacher uploads a file in the dashboard, the browser converts the physical file into a long string of text called a **Base64 String**. 
For example, a tiny image might look like this in Base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE...`

### 2. Saving as a Document
Once the file is converted into a string, we simply save it as a standard JSON document in a new MongoDB collection called `assets`. 

```javascript
const asset = {
  id: "asset-123",
  dayId: "d-abc", // Links this asset to a specific Day
  filename: "my-image.png",
  mimeType: "image/png",
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE..." // The actual file content!
}
```

### 3. Serving the Asset
When a student visits the site, or a teacher uses `<img src="/api/assets/d-abc/my-image.png">`, the backend server receives the request. It fetches the document from MongoDB, decodes the long Base64 string back into raw binary bytes, and sends it directly to the browser as a proper image or zip download!
