import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || uid("s")
  );
}

function stripComments(content: string, language: string): string {
  if (language === "html") {
    // Strip HTML comments that have newlines OR are longer than 40 chars
    return content.replace(/<!--([\s\S]*?)-->/g, (match, inner) => {
      if (inner.includes("\n") || inner.length > 40) {
        return ""; // remove detailed comments
      }
      return match; // keep basic comments
    });
  } else if (language === "css") {
    // Strip CSS comments
    return content.replace(/\/\*([\s\S]*?)\*\//g, (match, inner) => {
      if (inner.includes("\n") || inner.length > 40) {
        return ""; // remove detailed comments
      }
      return match; // keep basic comments
    });
  }
  return content;
}

const now = () => new Date().toISOString();

async function main() {
  const uri = process.env.MONGO_URI || "mongodb+srv://trylaptop2024:trylaptop2024@cluster0.q8qtgtu.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("codebuddy");
    const topicsCol = db.collection("topics");
    const daysCol = db.collection("days");
    const filesCol = db.collection("files");

    // 0. Cleanup previously created data
    console.log("Cleaning up all previous imported data...");
    await filesCol.deleteMany({});
    await daysCol.deleteMany({});
    await topicsCol.deleteMany({});
    console.log("Cleaned up old topics, days, and files.");

    // 1. Create Meaningful Topics
    const topicsData = [
      { id: uid("t"), categoryId: "c-html", title: "HTML Basics", description: "Days 1-5", min: 1, max: 5 },
      { id: uid("t"), categoryId: "c-html", title: "HTML Tables & Links", description: "Days 6-8", min: 6, max: 8 },
      { id: uid("t"), categoryId: "c-html", title: "HTML Semantic & Media", description: "Days 9-10", min: 9, max: 10 },
      { id: uid("t"), categoryId: "c-html", title: "HTML Forms", description: "Days 11-12", min: 11, max: 12 },
      { id: uid("t"), categoryId: "c-css", title: "CSS Basics", description: "Days 13-16", min: 13, max: 16 },
      { id: uid("t"), categoryId: "c-css", title: "CSS Box Model & Layout", description: "Days 17-20", min: 17, max: 20 },
      { id: uid("t"), categoryId: "c-css", title: "CSS Advanced", description: "Days 21-25", min: 21, max: 25 },
    ];

    for (const t of topicsData) {
      await topicsCol.insertOne({
        id: t.id,
        categoryId: t.categoryId,
        title: t.title,
        slug: slugify(t.title),
        description: t.description,
        createdAt: now(),
        updatedAt: now(),
      });
      console.log(`Created topic: ${t.title}`);
    }

    // 2. Read WebM3 directory
    const webM3Dir = path.resolve(process.cwd(), "WebM3");
    const entries = await fs.readdir(webM3Dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const folderName = entry.name;
      const dayMatch = folderName.match(/Day(\d+)/i);
      if (!dayMatch) {
        console.log(`Skipping non-day folder: ${folderName}`);
        continue;
      }

      const dayNumber = parseInt(dayMatch[1], 10);
      
      // Determine which topic this day belongs to
      const targetTopic = topicsData.find(t => dayNumber >= t.min && dayNumber <= t.max);
      
      if (!targetTopic) {
        console.log(`No topic mapping found for Day ${dayNumber}. Skipping.`);
        continue;
      }

      const day = {
        id: uid("d"),
        topicId: targetTopic.id,
        dayNumber,
        title: `Day ${dayNumber}`,
        note: "",
        createdAt: now(),
        updatedAt: now(),
      };
      await daysCol.insertOne(day);
      console.log(`Created Day ${dayNumber} in topic: ${targetTopic.title}`);

      // 3. Process files inside the day folder
      const dayDir = path.join(webM3Dir, folderName);
      const fileEntries = await fs.readdir(dayDir, { withFileTypes: true });

      let displayOrder = 1;
      
      for (const fileEntry of fileEntries) {
        if (!fileEntry.isFile()) continue;

        const ext = path.extname(fileEntry.name).toLowerCase();
        let language = "";
        if (ext === ".html") language = "html";
        else if (ext === ".css") language = "css";
        else if (ext === ".js") language = "javascript";
        else if (ext === ".txt") language = "text";
        else {
          console.log(`  Skipping non-code file: ${fileEntry.name}`);
          continue;
        }

        let content = await fs.readFile(path.join(dayDir, fileEntry.name), "utf-8");
        
        // Remove detailed/long comments
        content = stripComments(content, language);

        const codeFile = {
          id: uid("f"),
          dayId: day.id,
          filename: fileEntry.name,
          displayName: fileEntry.name,
          language,
          content,
          displayOrder: displayOrder++,
        };

        await filesCol.insertOne(codeFile);
        console.log(`  Inserted file: ${fileEntry.name} (${language})`);
      }
    }

    console.log("Re-import completed successfully with granular topics and stripped comments!");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await client.close();
  }
}

main();
