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
const lessonIds = new Set();
const glossary = new Map();
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
    for (const field of ["intro", "meaning", "technology"])
      assert.ok(c.story?.[field]?.trim(), c.title + " missing story " + field);
    assert.ok(c.story.steps.length >= 2 && c.story.steps.length <= 5, c.title);
    const frames = new Set();
    for (const frame of c.story.steps) {
      for (const field of ["from", "label", "to", "caption"])
        assert.ok(
          typeof frame[field] === "string" && frame[field].trim(),
          c.title + " missing frame " + field,
        );
      assert.ok(!frames.has(frame.caption), c.title + " repeats a frame");
      frames.add(frame.caption);
    }
    if (c.title === "Noisy Neighbor") assert.equal(c.story.steps.length, 2);
    if (c.story.fork) {
      const { entry, hub, branches } = c.story.fork;
      assert.equal(branches.length, 2);
      const links = [[entry, hub], ...branches.map((branch) => [hub, branch])];
      assert.equal(new Set([entry, hub, ...branches]).size, 4, c.title);
      for (const { from, to } of c.story.steps)
        assert.ok(
          links.some(([a, b]) => a === from && b === to),
          c.title + " highlights a missing link",
        );
    }
    assert.ok(c.terms.length > 0, c.title + " needs terminology");
    for (const { term, definition } of c.terms) {
      assert.ok(term.trim() && definition.trim(), c.title);
      if (!glossary.has(term)) glossary.set(term, definition);
    }
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
    lessonIds.add(group + "-" + id);
  }
  count += cards.length;
}
console.log(count + " valid lessons and quizzes");

const readData = async (name) =>
  JSON.parse(
    await readFile(new URL("../src/data/" + name + ".json", import.meta.url)),
  );
const assigned = new Set();
for (const item of await readData("cloud-examples")) {
  assert.ok(item.title && item.tradeoff && item.lessons.length);
  for (const id of item.lessons) {
    assert.ok(
      lessonIds.has(id) && !assigned.has(id),
      "Invalid cloud example mapping: " + id,
    );
    assigned.add(id);
  }
  for (const provider of [item.aws, item.azure]) {
    assert.ok(
      provider.path.length >= 2 &&
        provider.path.every(Boolean) &&
        provider.explanation,
    );
    assert.ok(
      provider.source.title &&
        new URL(provider.source.url).protocol === "https:",
    );
  }
}
const comparisons = await readData("api-comparison");
assert.deepEqual(
  comparisons.map((row) => row.name),
  ["RPC", "gRPC", "REST", "GraphQL"],
);
for (const row of comparisons) {
  assert.ok(lessonIds.has(row.lesson));
  assert.ok(
    row.request && row.model && row.benefit && row.tradeoff && row.source.title,
  );
  assert.equal(new URL(row.source.url).protocol, "https:");
}
console.log(
  assigned.size +
    " cloud example lesson mappings and four API approaches verified",
);

const termIds = new Set();
for (const group of await readData("terminology-groups")) {
  assert.ok(group.length >= 3, "Every term needs two alternative definitions");
  const definitions = group.map((term) => glossary.get(term));
  assert.ok(
    definitions.every(Boolean),
    "Missing glossary definition in " + group.join(", "),
  );
  assert.equal(
    new Set(definitions).size,
    group.length,
    "Duplicate definition in group",
  );
  for (const term of group) {
    const id = term
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, "");
    assert.ok(!termIds.has(id), "Repeated terminology question: " + term);
    termIds.add(id);
  }
}
assert.ok(termIds.size >= 20 && termIds.has("noisy-neighbour"));
console.log(termIds.size + " terminology questions verified");
