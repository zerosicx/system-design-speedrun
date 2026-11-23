import React, { useState } from "react";
import {
  ChevronLeft,
  Bookmark,
  Search,
  Layers3,
  CheckCircle2,
  Circle,
  BookOpen,
  Sprout,
  Zap,
  Shuffle,
  Check,
  ExternalLink,
} from "lucide-react";
import { chapters, concepts, inChapter } from "./curriculum";
import { href, go, Empty } from "./ui";
import { Question } from "./quiz";
const chapterFor = (id) => chapters.find((c) => c.id === id);

export function ListPage({ kind, chapter, p, bookmark, startQuiz }) {
  const [query, setQuery] = useState(""),
    [section, setSection] = useState("all");
  const pool =
    kind === "chapter"
      ? inChapter(chapter.id)
      : kind === "saved"
        ? concepts.filter((c) => p.saved.includes(c.id))
        : concepts;
  const shown = pool.filter(
    (c) =>
      (section === "all" || c.chapter === section) &&
      [
        c.title,
        c.section,
        c.lesson,
        c.detail,
        ...c.terms.flatMap(({ term, definition }) => [term, definition]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const title =
    kind === "chapter"
      ? chapter.name
      : kind === "saved"
        ? "Bookmarks"
        : "Concept index";
  return (
    <>
      <div className="page-intro">
        <div className="eyebrow mono">
          <span />
          {chapter ? "CHAPTER " + chapter.number : "FIELD GUIDE"}
        </div>
        <h1>{title}</h1>
        <p>
          {chapter
            ? chapter.description
            : kind === "saved"
              ? "Return to the ideas you want to practice again."
              : "Search every lesson or jump straight to a chapter."}
        </p>
      </div>
      <div className="panel">
        <div className="list-tools">
          <label className="search">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts"
              aria-label="Search concepts"
            />
          </label>
          {!chapter && (
            <select
              aria-label="Choose chapter"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="all">All chapters</option>
              {chapters.map((ch) => (
                <option value={ch.id} key={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          )}
          {shown.length > 0 && (
            <button className="button light" onClick={() => startQuiz(shown)}>
              <Layers3 size={16} />
              Quiz these
            </button>
          )}
        </div>
        <div className="list-count mono">
          {shown.length} {shown.length === 1 ? "CONCEPT" : "CONCEPTS"}
        </div>
        {shown.map((c) => (
          <div key={c.id} className="lesson-row">
            <a href={href("learn/" + c.id)}>
              {p.read.includes(c.id) ? (
                <CheckCircle2 size={20} className="read-check" />
              ) : (
                <Circle size={20} className="unread" />
              )}
              <div>
                <strong>{c.title}</strong>
                <small>
                  {c.section}
                  {p.read.includes(c.id) ? " · Studied" : ""}
                </small>
              </div>
            </a>
            <button
              className="icon-btn"
              aria-label={
                (p.saved.includes(c.id)
                  ? "Remove bookmark for "
                  : "Bookmark ") + c.title
              }
              onClick={() => bookmark(c.id)}
            >
              <Bookmark
                size={17}
                fill={p.saved.includes(c.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
        {!shown.length && (
          <Empty
            icon={kind === "saved" ? Bookmark : Search}
            title={
              kind === "saved" && !pool.length
                ? "Your bookmarks will grow here"
                : "No matching concepts"
            }
            body={
              kind === "saved" && !pool.length
                ? "Tap the bookmark on any lesson to save it for tomorrow."
                : "Try another search or chapter."
            }
          />
        )}
      </div>
    </>
  );
}
export function Lesson({ c, p, bookmark, mark, shuffle, onAnswer }) {
  const ch = chapterFor(c.chapter),
    items = inChapter(ch.id),
    index = items.findIndex((x) => x.id === c.id),
    globalIndex = concepts.findIndex((x) => x.id === c.id),
    next = concepts[globalIndex + 1],
    saved = p.saved.includes(c.id);
  return (
    <>
      <div className="page-intro">
        <a className="back-link" href={href("chapter/" + ch.id)}>
          <ChevronLeft size={15} />
          {ch.name}
        </a>
        <div className="lesson-heading">
          <div>
            <div className="eyebrow mono">
              CHAPTER {ch.number} · CONCEPT {index + 1} OF {items.length}
            </div>
            <h1>{c.title}</h1>
          </div>
          <button
            className="icon-btn large"
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Bookmark lesson"}
            onClick={() => bookmark(c.id)}
          >
            <Bookmark fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <article className="panel reading">
        <div className="eyebrow mono">
          <BookOpen size={16} /> FIELD NOTE
        </div>
        <p className="lead">{c.lesson}</p>
        <p className="lesson-detail">{c.detail}</p>
        <div className="example">
          <h3>
            <Sprout size={18} /> In practice
          </h3>
          <p>{c.example}</p>
        </div>
        <section className="lesson-terms" aria-label="Key terms">
          <h2>Key terms</h2>
          <dl>
            {c.terms.map(({ term, definition }) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
      <section className="panel recall">
        <div className="eyebrow mono">
          <Zap size={16} /> QUICK CHECK
        </div>
        <Question key={c.id} c={c} onAnswer={onAnswer} />
      </section>
      <div className="lesson-footer">
        <button className="button light" onClick={shuffle}>
          <Shuffle size={16} />
          Skip to random
        </button>
        <button
          className="button green"
          onClick={() => {
            mark(c.id);
            go(next ? "learn/" + next.id : "garden");
          }}
        >
          <Check size={18} />
          {p.read.includes(c.id)
            ? "Continue"
            : next
              ? "Mark studied & continue"
              : "Mark studied & finish"}
        </button>
      </div>
      <section className="lesson-references" aria-label="Free references">
        <h2>Free references</h2>
        <ul>
          {c.references.map(({ title, url, source }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <span>{title}</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <small>
                {new URL(url).hostname.replace(/^www\./, "")} ·{" "}
                {source === "roadmap.sh"
                  ? "Via roadmap.sh"
                  : "Additional reading"}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
