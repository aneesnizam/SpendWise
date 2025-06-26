import { serve } from "https://deno.land/std@0.97.0/http/server.ts";
import { readFile } from "https://deno.land/std@0.97.0/fs/mod.ts";

const server = serve({ port: 8000 });

console.log("HTTP server running on http://localhost:8000");

for await (const req of server) {
  const url = req.url === "/" ? "/index.html" : req.url;
  try {
    const file = await readFile(`./dist${url}`);
    req.respond({ status: 200, body: file });
  } catch {
    req.respond({ status: 404, body: "404 Not Found" });
  }
}