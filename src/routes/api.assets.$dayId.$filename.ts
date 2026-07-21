import { createFileRoute } from "@tanstack/react-router";
import { mongoRequest } from "@/lib/mongo.server";

// @ts-ignore
export const Route = createFileRoute("/api/assets/$dayId/$filename")({
  server: {
    handlers: {
      GET: async ({ params }: { params: any }) => {
        const { dayId, filename } = params;

        try {
          const res = await mongoRequest("assets", "findOne", { filter: { dayId, filename } });
          const asset = res?.document;

          if (!asset) {
            return new Response("Not found", { status: 404 });
          }

          // Asset data should be a base64 string, e.g. "iVBORw0KGgo..."
          // If the string starts with "data:image/png;base64,", we need to strip it.
          let base64Data = asset.data;
          if (base64Data.includes("base64,")) {
            base64Data = base64Data.split("base64,")[1];
          }

          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          return new Response(bytes.buffer, {
            status: 200,
            headers: {
              "Content-Type": asset.mimeType || "application/octet-stream",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          console.error("Error serving asset:", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
