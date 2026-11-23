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
    for (const k of ["title", "lesson", "detail", "example", "question", "why"])
      assert.ok(c[k]?.trim(), group + " missing " + k);
    assert.ok(sections.has(c.section), c.section);
    assert.ok(c.terms.length > 0, c.title + " needs terminology");
    for (const { term, definition } of c.terms)
      assert.ok(term.trim() && definition.trim(), c.title);
    assert.ok(c.references.length > 0, c.title + " needs references");
    for (const { title, url, source } of c.references) {
      assert.equal(new URL(url).protocol, "https:");
      assert.ok(
        title.trim() && ["roadmap.sh", "Supplementary"].includes(source),
        c.title,
      );
    }
    assert.equal(
      new Set(c.references.map((r) => r.url)).size,
      c.references.length,
    );
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
