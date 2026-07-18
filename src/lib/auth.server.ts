import { SignJWT, jwtVerify } from "jose";
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

// Ensure the admin collection is properly seeded if it doesn't exist
// This is called during login attempt
export async function verifyPassword(password: string): Promise<boolean> {
  // Try to find the admin user
  let res;
  try {
    res = await mongoRequest("users", "findOne", { filter: { username: "admin" } });
  } catch {
    return false;
  }

  // Very basic setup: if no user exists, we allow 'admin' to work initially,
  // and we'll insert them so they can change the password later.
  // In a real app, you'd use bcrypt to compare hashes. For simplicity without native node deps:
  if (!res.document) {
    if (password === "admin") {
      await mongoRequest("users", "insertOne", {
        document: { username: "admin", password: "admin" },
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
  if (!isAuthed) return false;

  await mongoRequest("users", "updateOne", {
    filter: { username: "admin" },
    update: { $set: { password: newPassword } },
  });

  return true;
}
