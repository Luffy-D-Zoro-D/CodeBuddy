# Advanced Security & Forensics Implementation Guide

This document outlines the architecture, logic, and edge cases for the "Unbeatable Security & Trap System" implemented in CodeBuddy. It is designed to be comprehensive enough that another AI system can replicate this logic in any modern web application.

## 1. Core Concept: Persistent Device Identity

The foundation of the security system relies on assigning and tracking device identities without relying exclusively on cookies or accounts.

### 1.1 The Silent Device ID
When a user opens the application for the exact first time, the client immediately generates a cryptographically secure random `deviceId` (e.g., `dev-xyz123`).
- This ID is saved to the browser's `localStorage`.
- **Crucial Fallback:** The application uses a central `getDeviceId()` getter. Every time the app loads, or an action is performed, it calls this getter. If `localStorage` has been cleared by the user, the getter *immediately* generates a brand new ID.

### 1.2 The Silent Registration
Merely generating the ID on the client is insufficient because clients can manipulate `localStorage`. 
- **The Mechanic:** The application features a "stealth" `useEffect` at the root of the app (`IdentityWall.tsx`).
- The moment the app mounts, it silently fires an unauthenticated API request: `registerDeviceSilent(deviceId, userAgent)`.
- The server records the `deviceId`, the current `timestamp` (`firstSeen`), and the user's browser fingerprint (`userAgent`).
- **Security Note:** Your backend *must* have an explicit whitelist allowing this specific unauthenticated API call to write to the `device_registry` collection.

---

## 2. Layer 1: The Identity Wall (Forced Registration)

The first layer of defense is the "Require Names" system, designed to prevent anonymous access.

### 2.1 The Mechanic
- A React component (`IdentityWall.tsx`) wraps the entire application.
- It continuously polls (every 10 seconds) the server: `checkIfRegistered(deviceId)`.
- If the Global Setting `requireNames` is ON, and the server responds `false`, the wall drops down, blurring the app and forcing the user to type their real name.

### 2.2 Server-Side Verification
- The wall **cannot** trust a local variable like `isRegistered = true`.
- If a student clears their cache to hide their identity, they wipe their `localStorage`. 
- Because `localStorage` is wiped, `getDeviceId()` generates a *new* ID.
- The new ID is not in the server's database of registered names. Therefore, the server responds `false`, and the Identity Wall immediately drops down, trapping the user again.

---

## 3. Layer 2: Targeted Traps (Device Banning)

Sometimes a student registers a fake name or submits inappropriate content. The teacher needs a way to instantly neutralize that specific device.

### 3.1 The Mechanic
- The teacher's dashboard displays a list of all feedback.
- Each feedback item includes the `deviceId` of the sender.
- The teacher clicks a **"Trap (Ban)"** button next to the feedback.
- The server adds that `deviceId` to a `bannedDevices` array in the `global_settings` collection.

### 3.2 The Trap Execution
- The `IdentityWall` on the student's device polls the `global_settings` every 10 seconds.
- If the student's `deviceId` is found in the `bannedDevices` array, the wall switches to **Trap Mode**.
- The screen turns solid red, displaying a massive "ACCESS REVOKED" message. They cannot dismiss it.

---

## 4. Layer 3: The Cache-Clear Trap & Forensics (The Masterstroke)

**The Problem:** A student sends a highly inappropriate message (e.g., at 10:00 AM). To avoid the teacher banning their device, the student instantly goes to browser settings and clears their `localStorage` cache. Their original `deviceId` is destroyed.

### 4.1 The Incident Investigation Dashboard
To combat this, the teacher dashboard features an **Investigate** button next to every piece of feedback.

1. **Browser Fingerprinting:** When the bad feedback was sent at 10:00 AM, the app secretly captured their `navigator.userAgent` (e.g., "Safari on Mac") and attached it to the feedback.
2. **The Suspect Scan:** When the teacher clicks "Investigate", the server queries the `device_registry` collection.
3. **The Trap Logic:** The server searches for ANY brand new `deviceId` whose `firstSeen` timestamp is *greater than* 10:00 AM.
4. **The Catch:** Because the student cleared their cache to hide, their browser instantly generated a *new* `deviceId` when they reopened the app at 10:01 AM. 
5. **The Match:** This new ID appears right at the top of the Suspect List. The system compares the suspect's `userAgent` with the bad feedback's `userAgent`. If both are "Safari on Mac", the UI highlights it in bright orange as a **Browser Match!**
6. **The Execution:** The teacher clicks "Trap Suspect" on the new ID. The student, who thought they were safe by clearing their cache, is instantly hit with the Red Screen of Death in the middle of class.

---

## 5. Layer 4: Global Lockdown Mode

If things get completely out of hand, the teacher can flip the "Lockdown Mode" switch.

### 5.1 The Mechanic
- The `IdentityWall` checks the `lockdownMode` boolean in `global_settings`.
- **Logic Rule:** `if (lockdownMode === true && !isRegistered)` -> **Trigger Red Trap Screen**.
- If a student is already registered, they are unaffected.
- If a student tries to clear their cache to hide, they lose their registered status. They become an unregistered device. Because Lockdown Mode is active, they are instantly trapped and cannot even attempt to type a new fake name.

---

## 6. Edge Cases Handled

1. **The "Stealth API" Block:** 
   - *Issue:* Unauthenticated API requests to register the device ID are blocked by default REST/GraphQL proxies.
   - *Solution:* Ensure `device_registry` UPSERT operations are explicitly whitelisted in the API gateway so clients can register themselves silently.
2. **The "Dark Mode Invisible Text" Bug:**
   - *Issue:* Highlighting suspects with `bg-orange-50` results in white text on a white background in Dark Mode.
   - *Solution:* Use translucent overlays like `bg-orange-500/10` with `border-orange-500/30` to maintain tint without destroying contrast in dark themes.
3. **The "Missing ID" Bug:**
   - *Issue:* If a user clears their cache, they don't have an ID. If the app only generates IDs on button clicks, the silent registration fails.
   - *Solution:* The root component MUST call the `getDeviceId()` generation function during its initial render/mount to guarantee an ID exists at all times.
