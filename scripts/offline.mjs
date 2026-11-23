import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path + "/" + e.name) : path + "/" + e.name,
      ),
    )
  ).flat();
}
const files = (await walk("dist"))
  .filter((s) => !s.endsWith("/sw.js") && !s.endsWith(".txt"))
  .sort();
const hash = createHash("sha256");
for (const file of files) hash.update(file).update(await readFile(file));
const cache = "stack-garden-" + hash.digest("hex").slice(0, 16);
const urls = files.map((s) => "./" + s.slice(5));
await writeFile(
  "dist/sw.js",
  `
const name = ${JSON.stringify(cache)};
const files = ${JSON.stringify(urls)};
const index = new URL('index.html', self.registration.scope).href;
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(name);
  await cache.addAll(files.map(path => new Request(new URL(path, self.registration.scope), {cache:'reload'})));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('stack-garden-') && key !== name) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(name);
    const hit = await cache.match(event.request.mode === 'navigate' ? index : event.request);
    return hit || fetch(event.request);
  })());
});`,
);
console.log("Offline bundle:", files.length, "assets");
