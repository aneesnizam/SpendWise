import { serve } from "https://deno.land/std/http/server.ts";
import { join, extname } from "https://deno.land/std/path/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";

const DIST_DIR = join(Deno.cwd(), "dist");

// Set no-cache headers for all responses
const noCacheHeaders = (type) => ({
  "Content-Type": type,
  "Cache-Control": "no-cache",
});

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);

  // ✅ Serve sitemap.xml
  if (pathname === "/sitemap.xml") {
    try {
      const sitemap = await Deno.readFile(join(DIST_DIR, "sitemap.xml"));
      return new Response(sitemap, {
        headers: noCacheHeaders("application/xml"),
      });
    } catch {
      return new Response("Sitemap not found", { status: 404 });
    }
  }

  // ✅ Serve robots.txt
  if (pathname === "/robots.txt") {
    try {
      const robots = await Deno.readFile(join(DIST_DIR, "robots.txt"));
      return new Response(robots, {
        headers: noCacheHeaders("text/plain"),
      });
    } catch {
      return new Response("robots.txt not found", { status: 404 });
    }
  }

  // ✅ Serve static files
  const filePath = join(DIST_DIR, pathname);
  try {
    const file = await Deno.readFile(filePath);
    const mime = contentType(extname(filePath)) || "application/octet-stream";
    return new Response(file, { headers: noCacheHeaders(mime) });
  } catch {
    // ✅ SPA fallback to index.html
    try {
      const fallback = await Deno.readFile(join(DIST_DIR, "index.html"));
      return new Response(fallback, {
        headers: noCacheHeaders("text/html"),
      });
    } catch {
      return new Response("404 Not Found", { status: 404 });
    }
  }
});
