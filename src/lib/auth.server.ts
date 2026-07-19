import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { mongoRequest } from "./mongo.server";
import crypto from "crypto";

const jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw && process.env.NODE_ENV === "production") {
  throw new Error("FATAL: JWT_SECRET environment variable is missing in production!");
}
const SECRET = new TextEncoder().encode(jwtSecretRaw || "fallback_super_secret_dev_key");

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPasswordHash(password: string, hash: string): boolean {
  if (!hash.includes(":")) return false;
  const [salt, key] = hash.split(":");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return key === derivedKey;
}

export async function createSessionToken(username: string, role: string = "teacher"): Promise<string> {
  const token = await new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  return token;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function verifyIsLuffy(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const payload = decodeJwt(token);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Ensure the users collection is properly seeded if it doesn't exist
// This is called during login attempt
export async function verifyCredentials(username: string, password: string): Promise<{ success: boolean; role?: string; actualUsername?: string }> {
  // Seed Mugiwara if he doesn't exist
  try {
    const mugiwaraRes = await mongoRequest("users", "findOne", { filter: { role: "admin" } });
    if (!mugiwaraRes.document) {
      await mongoRequest("users", "insertOne", {
        document: { username: "Mugiwara", password: hashPassword("SaDBo"), role: "admin" },
      });
    }
  } catch (err) {
    console.error("MongoDB Error checking/creating Mugiwara:", err);
  }

  // Seed Sir if he doesn't exist
  try {
    const sirRes = await mongoRequest("users", "findOne", { filter: { role: "teacher" } });
    if (!sirRes.document) {
      await mongoRequest("users", "insertOne", {
        document: { username: "Sir", password: hashPassword("SirLifts"), role: "teacher" },
      });
    }
  } catch (err) {
    console.error("MongoDB Error checking/creating Sir:", err);
  }

  // Try to find the user (case-insensitive)
  let res;
  try {
    res = await mongoRequest("users", "findOne", { filter: { username: { $regex: new RegExp(`^${username}$`, "i") } } });
  } catch (err) {
    console.error("MongoDB Error in verifyCredentials (findOne):", err);
    return { success: false };
  }

  if (!res.document) {
    return { success: false };
  }

  const isValid = verifyPasswordHash(password, res.document.password);
  return { success: isValid, role: res.document.role || "teacher", actualUsername: res.document.username };
}

export async function updateProfile(
  token: string | undefined,
  newUsername: string,
  newPassword?: string,
): Promise<{ success: boolean; newToken?: string; error?: string }> {
  const isAuthed = await verifyToken(token);
  if (!isAuthed || !token) return { success: false, error: "Not logged in" };

  const payload = decodeJwt(token);
  const oldUsername = payload.username as string;
  const role = (payload.role as string) || "teacher";

  // Check if new username is already taken by someone else
  if (newUsername.toLowerCase() !== oldUsername.toLowerCase()) {
    const existing = await mongoRequest("users", "findOne", { filter: { username: { $regex: new RegExp(`^${newUsername}$`, "i") } } });
    if (existing.document) {
      return { success: false, error: "Username is already taken" };
    }
  }

  const updateFields: any = { username: newUsername };
  if (newPassword) {
    updateFields.password = hashPassword(newPassword);
  }

  await mongoRequest("users", "updateOne", {
    filter: { username: oldUsername },
    update: { $set: updateFields },
  });

  const newToken = await createSessionToken(newUsername, role);
  return { success: true, newToken };
}
