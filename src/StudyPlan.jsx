import React from "react";
import { BookOpen, Target } from "lucide-react";
import { concepts } from "./curriculum";
import { href } from "./ui";

export function StudyPlan({ p, start }) {
  const unread = concepts.filter((c) => !p.read.includes(c.id));
  const words = unread.reduce(
    (n, c) =>
      n +
      [
        c.lesson,
        c.detail,
        c.example,
        ...c.terms.flatMap((t) => [t.term, t.definition]),
      ]
        .join(" ")
        .trim()
        .split(/\s+/).length,
    0,
  );
  const missed = concepts.filter((c) => p.missed.includes(c.id));
  const next = unread[0] || concepts[0];
  return (
    <>
      <div className="page-intro">
        <div className="eyebrow mono">
          <span /> TWO STUDY SESSIONS
        </div>
        <h1>Speedrun plan</h1>
        <p>Use tonight for a first pass and tomorrow morning for recall.</p>
      </div>
      <section className="panel plan-stage">
        <div className="eyebrow mono">
          <BookOpen size={16} /> TONIGHT
        </div>
        <h2>Read the field guide</h2>
        <p>
          {unread.length} lessons left. At 150–200 words per minute, the
          remaining core notes, examples, and key terms take about{" "}
          {Math.ceil(words / 200)}–{Math.ceil(words / 150)} minutes of reading.
          Allow extra time for cloud walkthroughs, comparison tables, breaks,
          and questions.
        </p>
        <p>
          Try a ten-minute reading block. Bookmark anything you couldn’t explain
          to a friend, then switch chapters if your attention drifts.
        </p>
        <div className="actions">
          <a className="button green" href={href("learn/" + next.id)}>
            {unread.length
              ? "Read next unstudied lesson"
              : "Revisit first lesson"}
          </a>
          <a className="button light" href={href("library")}>
            Jump to a topic
          </a>
        </div>
      </section>
      <section className="panel plan-stage">
        <div className="eyebrow mono">
          <Target size={16} /> TOMORROW MORNING
        </div>
        <h2>Explain it from memory</h2>
        <p>
          Start with a mixed round. Say why you chose your answer before
          revealing the explanation. Retry missed questions, then revisit
          bookmarked examples before midday.
        </p>
        <div className="actions">
          <button className="button green" onClick={() => start(concepts)}>
            Start mixed round
          </button>
          {missed.length > 0 && (
            <button className="button light" onClick={() => start(missed)}>
              Review missed ({missed.length})
            </button>
          )}
        </div>
      </section>
    </>
  );
}
