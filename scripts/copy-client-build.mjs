import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

await mkdir(distDir, { recursive: true });

for (const entry of await readdir(clientDir, { withFileTypes: true })) {
  await cp(path.join(clientDir, entry.name), path.join(distDir, entry.name), {
    recursive: true,
    force: true,
  });
}

await cp(path.join(serverDir, "index.js"), path.join(serverDir, "server.js"), {
  force: true,
});