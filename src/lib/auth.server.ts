import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { mongoRequest } from "./mongo.server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_dev_key");

export async function createSessionToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
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
    return payload.username === "luffy";
  } catch {
    return false;
  }
}

// Ensure the users collection is properly seeded if it doesn't exist
// This is called during login attempt
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  // Seed luffy if he doesn't exist
  try {
    const luffyRes = await mongoRequest("users", "findOne", { filter: { username: "luffy" } });
    if (!luffyRes.document) {
      await mongoRequest("users", "insertOne", {
        document: { username: "luffy", password: "luffy" },
      });
    }
  } catch (err) {
    console.error("MongoDB Error checking/creating luffy:", err);
  }

  // Try to find the user
  let res;
  try {
    res = await mongoRequest("users", "findOne", { filter: { username } });
  } catch (err) {
    console.error("MongoDB Error in verifyCredentials (findOne):", err);
    return false;
  }

  if (!res.document) {
    // Auto-create any new user so testing multiple users is easy
    await mongoRequest("users", "insertOne", {
      document: { username, password },
    });
    return true;
  }

  return res.document.password === password;
}

export async function changePassword(
  token: string | undefined,
  newPassword: string,
): Promise<boolean> {
  const isAuthed = await verifyToken(token);
  if (!isAuthed || !token) return false;

  const payload = decodeJwt(token);
  const username = payload.username as string;

  await mongoRequest("users", "updateOne", {
    filter: { username },
    update: { $set: { password: newPassword } },
  });

  return true;
}
