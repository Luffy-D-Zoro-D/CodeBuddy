# Authentication System Explanation

This document explains how the login and authentication system works in CodeBuddy. You can use these concepts to explain the project to your teacher.

## Core Concept: The "Digital ID Card"
Instead of keeping track of who is logged in on the server using complex sessions, we give the user a digital ID card after they log in. This ID card is called a **JWT (JSON Web Token)**. Every time the user asks to see a restricted page or add new code, they show this token. 

Because we built this using modern AI tools, we used an industry-standard library called **`jose`** to handle creating and verifying these tokens.

## Key Functions in `src/lib/auth.server.ts`

Here are the main JavaScript functions that make the authentication work. We can explain this in simple JS terms:

### 1. `hashPassword(password)`
**What it does:** We never save plain-text passwords in the database (like "hello123"). If the database gets hacked, we don't want people to see the real passwords.
**How it works:** It uses Node.js's built-in `crypto` library. It generates a random string called a "salt" and mixes it with the password using complex math (`scryptSync`). It returns a scrambled string like `randomSalt:scrambledPassword`.

### 2. `verifyPasswordHash(password, hash)`
**What it does:** When a user tries to log in, we need to check if their typed password matches the scrambled one in the database.
**How it works:** We can't unscramble the hash. Instead, we take the new password they just typed, mix it with the same salt, and see if the *newly scrambled* text perfectly matches the *old scrambled* text. If they match, the password is correct!

### 3. `verifyCredentials(username, password)`
**What it does:** This is the main login logic. 
**How it works:** 
1. It connects to our MongoDB database to look for the user's `username`.
2. It has a smart auto-setup feature: if the default admin ("Mugiwara") or teacher ("Sir") accounts don't exist in the database yet, it runs an `insertOne` database command to automatically create them!
3. If it finds the user, it grabs their scrambled password from the database.
4. It runs `verifyPasswordHash`. If it returns `true`, the login is successful.

### 4. `createSessionToken(username, role)`
**What it does:** If the login was successful, we run this function to create their Digital ID card (JWT).
**How it works:** It takes their username and role ("teacher" or "admin"), and signs it using a secret password (`JWT_SECRET`) that only our server knows. The token is set to expire in 7 days, so they don't have to keep logging in every day.

### 5. `verifyToken(token)`
**What it does:** Before letting a user delete a file or create a new topic, we run this function.
**How it works:** It checks the digital signature to ensure the token wasn't faked by a hacker and that the 7 days haven't passed.
