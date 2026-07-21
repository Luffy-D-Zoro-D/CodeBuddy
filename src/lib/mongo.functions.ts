/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { mongoRequest } from "./mongo.server";
import {
  createSessionToken,
  verifyCredentials,
  verifyToken,
  updateProfile,
  verifyIsLuffy,
} from "./auth.server";
import { formatCodeWithGroq, inferTopicWithGroq } from "./groq.server";

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
    if (collection === "users") {
      throw new Error("Direct access to the users collection is strictly prohibited");
    }

    // Only 'find' and 'findOne' are public, EXCEPT for inserting feedback or identity
    const safeAction = String(action || "").trim();
    if (safeAction !== "find" && safeAction !== "findOne") {
      const isPublicFeedbackInsert = collection === "feedback" && safeAction === "insertOne";
      const isPublicIdentityUpsert = collection === "student_identities" && safeAction === "updateOne";
      
      if (!isPublicFeedbackInsert && !isPublicIdentityUpsert) {
        const isAuthed = await verifyToken(token);
        if (!isAuthed) {
          throw new Error("Unauthorized: You must be logged in to modify data");
        }
      }
    }
    const result = await mongoRequest(collection, action, body);
    return result as any;
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data: { username, password } }) => {
    const res = await verifyCredentials(username, password);
    if (!res.success) {
      throw new Error("Invalid credentials");
    }
    const token = await createSessionToken(res.actualUsername || username, res.role);
    return { token };
  });

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; newUsername: string; newPassword?: string }) => d)
  .handler(async ({ data: { token, newUsername, newPassword } }) => {
    const res = await updateProfile(token, newUsername, newPassword);
    if (!res.success) {
      throw new Error(res.error || "Failed to update profile");
    }
    return { token: res.newToken! };
  });

export const formatWithAIFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; code: string; language: string; aiNote?: string }) => d)
  .handler(async ({ data: { token, code, language, aiNote } }) => {
    const isAuthed = await verifyToken(token);
    const isLuffy = await verifyIsLuffy(token);
    if (!isAuthed || !isLuffy) {
      throw new Error("Unauthorized: Only Mugiwara can use AI features");
    }
    const formattedCode = await formatCodeWithGroq(code, language, aiNote);
    return { formattedCode };
  });

export const inferTopicFn = createServerFn({ method: "POST" })
  .validator((d: { token: string; categoryName: string; existingTopics: { id: string; title: string }[]; fileContentsPreview: string; currentTopicId: string | null }) => d)
  .handler(async ({ data: { token, categoryName, existingTopics, fileContentsPreview, currentTopicId } }) => {
    const isAuthed = await verifyToken(token);
    const isLuffy = await verifyIsLuffy(token);
    if (!isAuthed || !isLuffy) {
      throw new Error("Unauthorized: Only Mugiwara can use AI features");
    }
    const result = await inferTopicWithGroq(categoryName, existingTopics, fileContentsPreview, currentTopicId);
    return { result };
  });
