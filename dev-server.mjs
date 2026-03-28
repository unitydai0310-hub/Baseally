import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

function parseArgs(argv) {
  const args = { host: "127.0.0.1", port: 5173 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--host" && argv[i + 1]) args.host = argv[i + 1];
    if (a === "--port" && argv[i + 1]) args.port = Number(argv[i + 1]);
  }
  return args;
}

const cli = parseArgs(process.argv.slice(2));
const host = process.env.HOST || cli.host;
const port = Number(process.env.PORT || cli.port);

const mimeByExt = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"]
]);

function safeResolve(requestPath) {
  const rel = requestPath.replace(/^\//, "");
  const resolved = path.resolve(rootDir, rel);
  const rootResolved = path.resolve(rootDir) + path.sep;
  if (!resolved.startsWith(rootResolved)) return null;
  return resolved;
}

function withIndexIfDir(requestPath) {
  if (requestPath.endsWith("/")) return requestPath + "index.html";
  return requestPath;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    const url = new URL(req.url, `http://${host}:${port}`);
    let reqPath = decodeURIComponent(url.pathname);
    reqPath = withIndexIfDir(reqPath);
    if (reqPath === "/") reqPath = "/index.html";

    const filePath = safeResolve(reqPath);
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeByExt.get(ext) || "application/octet-stream";

    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Baseally dev server: http://${host}:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Serving: ${rootDir}`);
});

server.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err?.message || err);
  process.exitCode = 1;
});
