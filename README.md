# CodeBuddy 🚀

CodeBuddy is a beautiful, interactive platform designed to help teachers share daily classroom code (HTML, CSS, JavaScript) with their students in an organized, day-by-day format.

## Features
- 📚 **Organized by Topic & Day**: Keep lecture notes, source code, and assets perfectly structured.
- 🔐 **Role-Based Authentication**: Secure logins for teachers and admins (using JWT).
- 🧠 **AI Code Formatting**: Uses Groq AI to automatically format and explain code snippets.
- ⚡ **Fast & Modern**: Built with Vite, React, Tailwind CSS, and TanStack Router.
- 💾 **MongoDB Powered**: Fast and flexible JSON-based cloud storage.

---

## 🛠️ Quick Start Guide

Follow these steps to run the CodeBuddy project on your local machine:

### 1. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a secret environment file so the app can connect to your database.
1. Duplicate the `.env.example` file and rename the copy to `.env`.
2. Open `.env` and fill in your actual credentials:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A random string of text used to secure logins.

### 3. Start the Development Server
Run the following command to start the app locally:
```bash
npm run dev
```
Open your browser and visit the local link provided in your terminal (usually `http://localhost:5173`).

---

## 📦 Database Migration Guide

If you ever need to move your CodeBuddy data to a brand new MongoDB cluster (for example, if you create a new Atlas account), you can easily clone your entire database using terminal commands.

*Note: You must have the [MongoDB Command Line Database Tools](https://www.mongodb.com/try/download/database-tools) installed on your computer to run these.*

### Step 1: Backup the Old Database
Run this command to download your entire database into a local folder named `dump/`:
```bash
mongodump --uri="YOUR_OLD_MONGO_URI"
```

### Step 2: Upload to the New Database
Run this command to upload that backup folder directly into your new database:
```bash
mongorestore --uri="YOUR_NEW_MONGO_URI" dump/
```

Once finished, just update the `MONGO_URI` in your `.env` file to the new link, restart your server, and you're good to go!

### Alternative: Migrate from Local Files (Script)
If you prefer to start completely fresh and upload your local files to a new database (discarding any manual edits made via the live website), you can use the included `importWebM3.ts` script.

1. Ensure your `MONGO_URI` in your `.env` file is set to the **new** database.
2. Create a folder named `WebM3` in the root of your project.
3. Organize your code files inside it grouped by days (e.g., `WebM3/Day1/index.html`).
4. Run the script to parse the folder and upload everything to the new database:
```bash
npx tsx importWebM3.ts
```
