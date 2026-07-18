/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ServerApiVersion, Collection, Document, WithId } from "mongodb";

// Cache the MongoClient so we don't reconnect on every hot reload or function invocation
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI in .env");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function mongoRequest(
  collectionName: string,
  action: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "deleteMany",
  body: Record<string, any> = {},
) {
  const client = await getMongoClient();

  // Extract database name from URI, or default to codebuddy if not provided in URI
  const db = client.db();
  const collection = db.collection(collectionName);

  switch (action) {
    case "find": {
      const documents = await collection.find(body.filter || {}).toArray();
      return { documents: JSON.parse(JSON.stringify(documents)) as any[] };
    }
    case "findOne": {
      const document = await collection.findOne(body.filter || {});
      return { document: document ? (JSON.parse(JSON.stringify(document)) as any) : null };
    }
    case "insertOne": {
      const result = await collection.insertOne(body.document);
      return { insertedId: result.insertedId.toString() };
    }
    case "updateOne": {
      const result = await collection.updateOne(body.filter || {}, body.update || {});
      return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
    }
    case "deleteOne": {
      const result = await collection.deleteOne(body.filter || {});
      return { deletedCount: result.deletedCount };
    }
    case "deleteMany": {
      const result = await collection.deleteMany(body.filter || {});
      return { deletedCount: result.deletedCount };
    }
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}
