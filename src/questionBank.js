import { concepts, slug } from "./curriculum";
import groups from "./data/terminology-groups.json";

// Each group contains related terms with distinct meanings, so the other
// definitions make plausible alternatives with a single correct answer.
const glossary = new Map();
for (const lesson of concepts) {
  for (const entry of lesson.terms) {
    if (!glossary.has(entry.term))
      glossary.set(entry.term, { ...entry, lesson });
  }
}

export const terminology = groups.flatMap((group) =>
  group.map((term) => {
    const { lesson } = glossary.get(term);
    const answerTerms = [term, ...group.filter((other) => other !== term)];
    return {
      id: "term-" + slug(term),
      term,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      question: "What does “" + term + "” mean?",
      answers: answerTerms.map((label) => glossary.get(label).definition),
      answerTerms,
      why: lesson.example,
    };
  }),
);

export const questionById = Object.fromEntries(
  [...concepts, ...terminology].map((item) => [item.id, item]),
);

export const missedQuestions = (ids) =>
  ids.map((id) => questionById[id]).filter(Boolean);
