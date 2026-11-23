import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const sections = new Set([
  "Foundations",
  "Reliability",
  "Networking",
  "Service architecture",
  "Data systems",
  "Caching",
  "Messaging",
  "Observability",
  "Cloud patterns",
  "Security",
]);
let count = 0;
for (const group of ["core", "systems", "patterns"]) {
  const cards = JSON.parse(
    await readFile(new URL("../src/data/" + group + ".json", import.meta.url)),
  );
  const ids = new Set();
  for (const c of cards) {
    for (const k of ["title", "lesson", "example", "question", "why"])
      assert.ok(c[k]?.trim(), group + " missing " + k);
    assert.ok(sections.has(c.section), c.section);
    assert.equal(c.answers.length, 3);
    assert.equal(new Set(c.answers).size, 3);
    const id = c.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, "");
    assert.ok(!ids.has(id), "Duplicate ID in " + group + ": " + id);
    ids.add(id);
  }
  count += cards.length;
}
console.log(count + " valid lessons and quizzes");
