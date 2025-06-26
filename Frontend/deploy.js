import { serve } from "https://deno.land/std/http/server.ts";
import { join, extname } from "https://deno.land/std/path/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";

const DIST_DIR = join(Deno.cwd(), "dist"); // Your build output folder
const ASSETS_DIR = join(DIST_DIR, "assets"); // Static assets folder

async function handler(req) {
  const url = new URL(req.url);
  let filePath = join(DIST_DIR, url.pathname);

  // Serve static files for any request with an extension (e.g., .js, .json, .css)
  if (extname(url.pathname)) {
    try {
      const file = await Deno.readFile(filePath);
      const mimeType = contentType(extname(filePath)) || "application/octet-stream";
      return new Response(file, {
        headers: { "content-type": mimeType },
      });
    } catch {
      return new Response("404 Not Found", { status: 404 });
    }
  }

  // Otherwise serve index.html for SPA routing fallback
  try {
    const file = await Deno.readFile(join(DIST_DIR, "index.html"));
    return new Response(file, { headers: { "Content-Type": "text/html" } });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
}


serve(handler);
