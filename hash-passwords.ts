import { mongoRequest } from "./src/lib/mongo.server";
import { hashPassword } from "./src/lib/auth.server";
import { config } from "dotenv";

// Load .env so process.env.MONGO_URI is set
config();

async function migratePasswords() {
  console.log("Fetching users...");
  const res = await mongoRequest("users", "find", {});
  const users = res.documents || [];
  
  let updatedCount = 0;
  for (const user of users) {
    if (user.password && !user.password.includes(":")) {
      console.log(`Hashing password for user: ${user.username}`);
      const hashed = hashPassword(user.password);
      await mongoRequest("users", "updateOne", {
        filter: { _id: user._id },
        update: { $set: { password: hashed } }
      });
      updatedCount++;
    }
  }
  
  console.log(`Migration complete! Hashed ${updatedCount} passwords.`);
  process.exit(0);
}

migratePasswords().catch(e => {
  console.error("Migration failed:", e);
  process.exit(1);
});
