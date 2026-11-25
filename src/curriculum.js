import core from "./data/core.json";
import systems from "./data/systems.json";
import patterns from "./data/patterns.json";

import cloudExamples from "./data/cloud-examples.json";
import apiComparison from "./data/api-comparison.json";

const exampleByLesson = new Map(
  cloudExamples.flatMap((scenario) =>
    scenario.lessons.map((id) => [id, scenario]),
  ),
);
const comparisonLessons = new Set([
  "systems-communication",
  ...apiComparison.map((row) => row.lesson),
]);

export const slug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");
const metadata = [
  [
    "Foundations",
    "Start with requirements, trade-offs, and the promises a system makes.",
    "#e1e9cb",
  ],
  [
    "Networking",
    "Follow a request from a device to the service that answers it.",
    "#cde1f1",
  ],
  [
    "Data systems",
    "Choose how to store, partition, and retrieve your data.",
    "#e6d7f1",
  ],
  ["Reliability", "Keep systems available when components fail.", "#fddcc7"],
  [
    "Service architecture",
    "Connect services and decide where each responsibility belongs.",
    "#cff0eb",
  ],
  [
    "Caching",
    "Keep frequently used data close and decide when to refresh it.",
    "#faeac2",
  ],
  [
    "Messaging",
    "Move work between services with queues, events, and consumers.",
    "#d7e9d1",
  ],
  [
    "Observability",
    "Spot bottlenecks and understand what a running system is doing.",
    "#fad8cd",
  ],
  [
    "Cloud patterns",
    "Apply reusable design patterns to common cloud problems.",
    "#cae2f7",
  ],
  [
    "Security",
    "Limit access and protect the boundaries between services.",
    "#e1e9cb",
  ],
];
export const chapters = metadata.map(([name, description, color], i) => ({
  name,
  id: slug(name),
  description,
  color,
  number: String(i + 1).padStart(2, "0"),
}));
export const concepts = chapters.flatMap((chapter) =>
  [core, systems, patterns].flatMap((group, index) =>
    group
      .filter((item) => item.section === chapter.name)
      .map((item) => {
        const id =
          ["core", "systems", "patterns"][index] + "-" + slug(item.title);
        const cloudExample = exampleByLesson.get(id);
        const hasComparison = comparisonLessons.has(id);
        const searchText = [
          item.story.intro,
          item.story.meaning,
          ...item.story.steps.flatMap((step) => [
            step.from,
            step.label,
            step.to,
            step.caption,
          ]),
          item.story.technology,
          item.title,
          item.section,
          item.lesson,
          item.detail,
          item.example,
          ...item.terms.flatMap((t) => [t.term, t.definition]),
          ...(cloudExample
            ? [
                cloudExample.title,
                "AWS Azure",
                ...cloudExample.aws.path,
                cloudExample.aws.explanation,
                ...cloudExample.azure.path,
                cloudExample.azure.explanation,
                cloudExample.tradeoff,
              ]
            : []),
          ...(hasComparison ? apiComparison.map((row) => row.name) : []),
        ]
          .join(" ")
          .toLowerCase();
        return {
          ...item,
          id,
          title: item.title.trim(),
          chapter: chapter.id,
          cloudExample,
          hasComparison,
          searchText,
        };
      }),
  ),
);
export const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
export const inChapter = (id) => concepts.filter((c) => c.chapter === id);
export function randomOrder(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
