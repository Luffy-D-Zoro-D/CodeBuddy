import { MongoClient } from "mongodb";

async function main() {
  const uri =
    "mongodb+srv://trylaptop2024:trylaptop2024@cluster0.q8qtgtu.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("codebuddy");

    // Find the file we just created
    const file = await db.collection("files").findOne({ displayName: "download.md" });
    if (file) {
      // Fix the content by replacing literal '\n' with actual newlines
      const fixedContent =
        "## Course Assets\\n\\n[Download Assets Here](/src.zip)\\n\\nClick the link above to download the zip file containing all images, audio, and video files used in the HTML module.";

      await db.collection("files").updateOne({ id: file.id }, { $set: { content: fixedContent } });
      console.log("Fixed the content formatting!");
    } else {
      console.log("File not found");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
