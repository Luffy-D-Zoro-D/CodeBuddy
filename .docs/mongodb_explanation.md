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
