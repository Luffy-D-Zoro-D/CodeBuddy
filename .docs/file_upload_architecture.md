# File Upload Architecture in CodeBuddy

CodeBuddy handles two distinct types of file uploads: **Binary Assets** (images, zip files) and **Code Files** (HTML, CSS, JS text). This document explains the complete lifecycle of both workflows from end to end.

---

## 1. Binary Assets (Images, ZIPs)

Because we use the MongoDB Atlas Data API (which speaks JSON) and don't have a traditional file system (like AWS S3) attached, we store binary files directly in the database as encoded strings.

### Phase 1: Selection & Conversion (Frontend)
1. **File Selection**: The teacher clicks "Upload Asset" and a native `<input type="file" multiple />` allows them to pick files from their laptop.
2. **FileReader API**: Once selected, we use the browser's built-in `FileReader` API.
3. **Base64 Encoding**: We call `reader.readAsDataURL(file)`. This reads the raw binary data of the file and encodes it into a **Base64 Data URI** string. 
   - *Example Output*: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`

### Phase 2: Storage (Backend & MongoDB)
1. **Transmission**: The Base64 string, along with the file's `name` and `mimeType` (e.g., `image/png`), is sent to our TanStack server function (`api.createAsset`).
2. **Database Storage**: The server saves this exact string directly into the MongoDB `assets` collection. MongoDB has a strict 16MB limit per document, which effectively limits our maximum upload size to ~12-15MB (accounting for Base64 overhead).

### Phase 3: Retrieval & Decoding (The Asset Server)
When a student's browser encounters an image tag like `<img src="/api/assets/d-123/img.png" />`, it makes a standard HTTP GET request. We intercept this in our custom route: `src/routes/api.assets.$dayId.$filename.ts`.

1. **Database Fetch**: The server queries MongoDB for the asset matching the `dayId` and `filename`.
2. **Stripping the Prefix**: The database returns the Base64 Data URI. The server splits the string at `"base64,"` and discards the prefix, leaving only the raw base64 data (`iVBORw0KGgo...`).
3. **Base64 to Binary**: The server uses Node's native `atob()` function to decode the base64 string back into a binary string.
4. **Buffer Conversion**: The binary string is iterated over and converted into a `Uint8Array` (an array of raw bytes).
5. **Serving to Client**: Finally, we return the raw bytes as a standard `Response` buffer. We set the HTTP headers to include the correct `Content-Type` (from the saved `mimeType`) and caching instructions.
   
*Result*: The browser receives a completely standard binary file. It has no idea the file was ever converted to Base64 or stored in a database.

---

## 2. Code Files (HTML, CSS, JS)

The workflow for code files is much simpler because they are already text.

### Phase 1: Selection & Conversion (Frontend)
1. **File Selection**: In the "Add File" dialog, the teacher uses the "Upload Files" tab to select local code files.
2. **FileReader API**: Instead of Data URLs, we call `reader.readAsText(file)`. 
3. **Text Extraction**: The browser extracts the raw plaintext from the file (e.g., `<html><body>...</body></html>`).

### Phase 2: Storage & Usage
1. **Database Storage**: The raw text is saved into the MongoDB `files` collection under the `content` field.
2. **Rendering**: When a student opens the Day, the frontend fetches the JSON data containing the text. The text is directly injected into the **CodeMirror** editor, allowing the student to read, edit, and execute it.

> [!NOTE] 
> **Why two approaches?**
> Text files don't need Base64 encoding; storing them as plaintext makes them easily searchable and editable. Binary files *must* be encoded to Base64 to survive transmission inside JSON payloads (which the MongoDB Data API strictly requires).
