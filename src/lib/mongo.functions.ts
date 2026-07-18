/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { mongoRequest } from "./mongo.server";
import { createSessionToken, verifyPassword, verifyToken, changePassword } from "./auth.server";
import { formatCodeWithGroq } from "./groq.server";

// Authenticated proxy for Atlas Data API calls
export const runMongoOp = createServerFn({ method: "POST" })
  .validator(
    (d: {
      token?: string;
      collection: string;
      action: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "deleteMany";
      body?: Record<string, any>;
    }) => d,
  )
  .handler(async ({ data: { token, collection, action, body } }) => {
    // Only 'find' and 'findOne' are public
    if (action !== "find" && action !== "findOne") {
      const isAuthed = await verifyToken(token);
      if (!isAuthed) {
        throw new Error("Unauthorized");
      }
    }
    const result = await mongoRequest(collection, action, body);
    return result as any;
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data: { username, password } }) => {
    if (username !== "admin") {
      throw new Error("Invalid credentials");
    }
    const isValid = await verifyPassword(password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    const token = await createSessionToken(username);
    return { token };
  });

export const changePasswordFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; newPassword: string }) => d)
  .handler(async ({ data: { token, newPassword } }) => {
    const success = await changePassword(token, newPassword);
    if (!success) {
      throw new Error("Unauthorized or failed to change password");
    }
    return { success };
  });

export const formatWithAIFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; code: string; language: string; aiNote?: string }) => d)
  .handler(async ({ data: { token, code, language, aiNote } }) => {
    const isAuthed = await verifyToken(token);
    if (!isAuthed) {
      throw new Error("Unauthorized");
    }
    const formattedCode = await formatCodeWithGroq(code, language, aiNote);
    return { formattedCode };
  });
