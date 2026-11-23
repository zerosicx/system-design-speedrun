import React, { useState } from "react";
import {
  Check,
  Layers3,
  RotateCcw,
  Bookmark,
  Flag,
  ChevronLeft,
} from "lucide-react";
import { concepts, randomOrder } from "./curriculum";
import { href, join, Meter } from "./ui";

export function Question({ c, onAnswer }) {
  const [order] = useState(() => randomOrder([0, 1, 2])),
    [choice, setChoice] = useState(null);
  const locked = choice !== null;
  function choose(i) {
    if (locked) return;
    setChoice(i);
    onAnswer(c.id, i === 0);
  }
  return (
    <>
      <h2 className="question">{c.question}</h2>
      <div className="answers">
        {order.map((i, j) => (
          <button
            key={i}
            disabled={locked}
            className={join(
              "answer",
              locked && i === 0 && "right",
              locked && i === choice && i !== 0 && "wrong",
            )}
            onClick={() => choose(i)}
          >
            <span className="answer-letter">{String.fromCharCode(65 + j)}</span>
            <span>{c.answers[i]}</span>
            {locked && i === 0 && <Check size={18} />}
          </button>
        ))}
      </div>
      {locked && (
        <div
          role="status"
          className={"explanation " + (choice === 0 ? "yes" : "no")}
        >
          <strong>
            {choice === 0 ? "That’s right." : "Worth another look."}
          </strong>{" "}
          {c.why}
        </div>
      )}
    </>
  );
}
export function QuizRoom({ p, start }) {
  const options = [
    [
      Layers3,
      "Mixed practice",
      "Five random questions from across the field guide.",
      concepts,
    ],
    [
      RotateCcw,
      "Review missed",
      "Practice the questions you last answered incorrectly.",
      concepts.filter((c) => p.missed.includes(c.id)),
    ],
    [
      Bookmark,
      "Bookmarked concepts",
      "Quiz the ideas you saved for a second look.",
      concepts.filter((c) => p.saved.includes(c.id)),
    ],
  ];
  return (
    <>
      <div className="page-intro">
        <div className="eyebrow mono">
          <span /> RECALL PRACTICE
        </div>
        <h1>Quiz room</h1>
        <p>
          Try a short round tonight. Come back tomorrow to review what you
          missed.
        </p>
      </div>
      <div className="quiz-options">
        {options.map(([Icon, title, desc, pool], i) => (
          <div className="panel quiz-option" key={title}>
            <span className={"stat-icon " + ["sage", "peach", "lilac"][i]}>
              <Icon size={22} />
            </span>
            <h2>{title}</h2>
            <p>{desc}</p>
            <button
              className="button green"
              disabled={!pool.length}
              onClick={() => start(pool)}
            >
              {pool.length
                ? "Start " + Math.min(5, pool.length) + " questions"
                : i === 1
                  ? "No missed questions"
                  : "No bookmarks yet"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export function QuizRun({ session, onAnswer, start }) {
  const [i, setIndex] = useState(0),
    [results, setResults] = useState([]);
  const c = session[i],
    answered = results.length > i;
  if (!c)
    return (
      <section className="panel result">
        <div className="stat-icon sage">
          <Flag />
        </div>
        <div className="eyebrow mono">SESSION COMPLETE</div>
        <h1>
          {results.filter(Boolean).length} / {session.length} correct
        </h1>
        <p>
          {results.every(Boolean)
            ? "You recalled every idea in this round."
            : "Your missed questions are ready for another round in the quiz room."}
        </p>
        <div className="actions">
          <button className="button green" onClick={() => start(concepts)}>
            New mixed round
          </button>
          <a className="button light" href={href("quiz")}>
            Quiz room
          </a>
        </div>
      </section>
    );
  return (
    <>
      <a href={href("quiz")} className="back-link">
        <ChevronLeft size={15} />
        Leave round
      </a>
      <div className="panel quiz-panel">
        <div className="eyebrow mono">
          QUESTION {i + 1} OF {session.length}
        </div>
        <Meter n={i} total={session.length} />
        <Question
          key={c.id}
          c={c}
          onAnswer={(id, right) => {
            onAnswer(id, right);
            setResults((r) => [...r, right]);
          }}
        />
        {answered && (
          <button
            className="button green"
            onClick={() => setIndex((x) => x + 1)}
          >
            {i + 1 === session.length ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </>
  );
}
