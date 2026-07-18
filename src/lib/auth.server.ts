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

// Ensure the users collection is properly seeded if it doesn't exist
// This is called during login attempt
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  // Try to find the user
  let res;
  try {
    res = await mongoRequest("users", "findOne", { filter: { username } });
  } catch (err) {
    console.error("MongoDB Error in verifyCredentials (findOne):", err);
    return false;
  }

  // Very basic setup: if no user exists AT ALL in the DB, we bootstrap the first user
  if (!res.document) {
    let allUsers;
    try {
      allUsers = await mongoRequest("users", "find", { filter: {} });
    } catch (err) {
      console.error("MongoDB Error in verifyCredentials (find all):", err);
      return false;
    }
    if (!allUsers.documents || allUsers.documents.length === 0) {
      await mongoRequest("users", "insertOne", {
        document: { username, password },
      });
      return true;
    }
    return false;
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
