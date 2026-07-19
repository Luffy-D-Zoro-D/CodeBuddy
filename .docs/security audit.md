# CodeBuddy Security Audit & Remediation Plan

This document outlines the security vulnerabilities found during the security audit of the CodeBuddy application, along with a plan to fix them.

## 1. Executive Summary
CodeBuddy currently suffers from several **Critical** security vulnerabilities, primarily stemming from its direct MongoDB proxy implementation (`runMongoOp`) and authentication architecture. If deployed to production in its current state, an attacker could easily download the entire database (including user credentials), modify or delete course materials, and hijack accounts.

## 2. Identified Vulnerabilities

### [CRITICAL] 2.1 Arbitrary Database Read / NoSQL Injection (CWE-285 / CWE-943)
- **Location:** `src/lib/mongo.functions.ts` (`runMongoOp`)
- **Description:** The `runMongoOp` server function allows unauthenticated users to pass arbitrary queries to the `find` and `findOne` actions for **any collection**. 
- **Impact:** An attacker can query the `users` collection to dump all usernames and passwords.
- **Remediation:** 
  1. Restrict public read access to specific collections (e.g., `categories`, `topics`, `days`, `files`).
  2. Completely block access to the `users` collection from the generic `runMongoOp` endpoint.

### [CRITICAL] 2.2 Broken Access Control for Database Mutations (CWE-285)
- **Location:** `src/lib/mongo.functions.ts` (`runMongoOp`)
- **Description:** While mutation actions (`insertOne`, `updateOne`, `deleteMany`, etc.) require a valid JWT token, they **do not verify the user's role**. Any authenticated user (e.g., a student) can send requests to modify or delete the entire curriculum or change other users' passwords.
- **Impact:** Total loss of data integrity; privilege escalation.
- **Remediation:** Enforce Role-Based Access Control (RBAC). Only the admin (`luffy`) should be allowed to perform mutations via `runMongoOp`. 

### [HIGH] 2.3 Plaintext Password Storage (CWE-256)
- **Location:** `src/lib/auth.server.ts`
- **Description:** User passwords (including the admin's) are stored in plaintext in the MongoDB database. 
- **Impact:** If the database is compromised (e.g., via 2.1), the attacker instantly gains access to all user accounts.
- **Remediation:** Implement password hashing using `bcrypt` or a similar standard library before storing or verifying passwords.

### [HIGH] 2.4 Insecure Auto-Registration on Login (CWE-287)
- **Location:** `src/lib/auth.server.ts` (`verifyCredentials`)
- **Description:** If a user attempts to log in with a username that does not exist, the system automatically creates a new account with that username and password. 
- **Impact:** Allows unlimited account creation, leading to potential database exhaustion (DoS), and prevents legitimate users from creating their account if an attacker registers their username first.
- **Remediation:** Separate registration and login logic, or disable public registration if the platform is invite-only.

### [MEDIUM] 2.5 Hardcoded / Weak JWT Secret Fallback (CWE-798)
- **Location:** `src/lib/auth.server.ts`
- **Description:** The application falls back to `"fallback_super_secret_dev_key"` if `JWT_SECRET` is not set in the environment variables.
- **Impact:** If deployed to production without a proper `.env`, attackers can forge admin JWT tokens.
- **Remediation:** Throw an error and refuse to start the server if `JWT_SECRET` is missing in production.

## 3. Implementation Plan

To secure the application, we propose the following implementation phases:

### Phase 1: Patch Critical Access Control Flaws
1. **Modify `runMongoOp`**: 
   - Block `users` collection completely from this endpoint.
   - Enforce that `action !== "find" && action !== "findOne"` requires the user to be `luffy` (Admin), not just any authenticated user.

### Phase 2: Secure Authentication
1. **Remove Auto-Registration**: Update `verifyCredentials` to return `false` if the user is not found, rather than auto-creating the account. 
2. **Password Hashing**: We will add a script to hash existing passwords and update `verifyCredentials` to use `bcrypt` (or `crypto.scrypt` native to Node) for verification.

### Phase 3: Hardening
1. Add environment variable checks on server startup to prevent weak fallback secrets.
2. Ensure proper input sanitization on all server functions.
