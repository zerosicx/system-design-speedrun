import React, { useState } from "react";
import {
  ShieldCheck,
  Sprout,
  Download,
  Settings2,
  BookOpen,
  Target,
  Bookmark,
  Play,
  Shuffle,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { chapters, concepts, byId, inChapter } from "./curriculum";
import { nav, href, percentage, join, Meter, Empty } from "./ui";

function Artwork({ chapter }) {
  return chapter.id === "security" ? (
    <ShieldCheck size={54} strokeWidth={1.5} className="shield-art" />
  ) : (
    <img src={"./art/" + chapter.id + ".webp"} alt="" />
  );
}
export function Navigation({ page, p, onOpen, onNavigate }) {
  const pct = percentage(p.read.length, concepts.length);
  return (
    <>
      <a href={href()} className="brand" onClick={onNavigate}>
        <img src="./art/sprout-64.png" alt="" />
        <span>Stack Garden</span>
      </a>
      <div className="nav-label mono">WORKSPACE</div>
      <nav>
        {nav.map(([id, label, Icon]) => (
          <a
            href={href(id)}
            key={id}
            aria-current={page === id ? "page" : undefined}
            onClick={onNavigate}
            className={join("nav-link", page === id && "active")}
          >
            <Icon size={19} />
            {label}
            {id === "saved" && p.saved.length > 0 && (
              <small>{p.saved.length}</small>
            )}
          </a>
        ))}
      </nav>
      <div className="rail-bottom">
        <div className="rail-progress">
          <div className="rail-progress-title">
            <Sprout size={17} /> Your progress <b className="mono">{pct}%</b>
          </div>
          <Meter n={p.read.length} total={concepts.length} />
          <small>
            {p.read.length} of {concepts.length} concepts studied
          </small>
        </div>
        <button className="nav-link" onClick={() => onOpen("install")}>
          <Download size={18} />
          Install app
        </button>
        <button className="nav-link" onClick={() => onOpen("settings")}>
          <Settings2 size={18} />
          Preferences
        </button>
      </div>
    </>
  );
}
function Stats({ p }) {
  const list = [
    [
      BookOpen,
      "Concepts studied",
      p.read.length,
      " / " + concepts.length,
      "sage",
    ],
    [
      Target,
      "Quiz accuracy",
      p.attempts ? percentage(p.correct, p.attempts) + "%" : "—",
      null,
      "peach",
    ],
    [Bookmark, "Bookmarked", p.saved.length, null, "lilac"],
  ];
  return (
    <section className="stats" aria-label="Study statistics">
      {list.map(([Icon, label, value, suffix, color]) => (
        <div className="stat" key={label}>
          <span className={"stat-icon " + color}>
            <Icon size={20} />
          </span>
          <div>
            <strong>
              {value}
              <small>{suffix}</small>
            </strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
export function Garden({ p, shuffle }) {
  const [view, setView] = useState("grid"),
    [filter, setFilter] = useState("all");
  const resume =
    byId[p.last] || concepts.find((c) => !p.read.includes(c.id)) || concepts[0];
  const shown = chapters.filter((ch) => {
    const items = inChapter(ch.id),
      n = items.filter((c) => p.read.includes(c.id)).length;
    return (
      filter === "all" ||
      (filter === "new" && n === 0) ||
      (filter === "started" && n > 0 && n < items.length) ||
      (filter === "done" && n === items.length)
    );
  });
  return (
    <>
      <section className="hero">
        <div
          className="hero-art"
          role="img"
          aria-label="Pixel art computer desk in a tiny forest garden"
        />
        <div className="hero-copy">
          <div className="hero-label mono">
            <Sprout size={14} /> INTERACTIVE FIELD GUIDE
          </div>
          <h1>
            System Design
            <br />
            <em>Speedrun</em>
          </h1>
          <p>
            Bite-sized lessons and quick quizzes.
            <br />
            Explore the roadmap at your own pace.
          </p>
          <div className="hero-actions">
            <a className="button gold" href={href("learn/" + resume.id)}>
              <Play size={16} fill="currentColor" />
              {p.last ? "Resume study" : "Start studying"}
            </a>
            <button className="button hero-secondary" onClick={shuffle}>
              <Shuffle size={17} />
              Shuffle topic
            </button>
          </div>
        </div>
      </section>
      <Stats p={p} />
      <div className="library-head">
        <div>
          <div className="eyebrow mono">
            <span /> THE ROADMAP
          </div>
          <h2>Chapter library</h2>
        </div>
        <div className="view-options">
          <div className="select-wrap">
            <select
              aria-label="Filter chapters"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All chapters</option>
              <option value="new">Unstarted</option>
              <option value="started">In progress</option>
              <option value="done">Completed</option>
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="segmented">
            {[
              [LayoutGrid, "grid"],
              [List, "list"],
            ].map(([Icon, v]) => (
              <button
                key={v}
                aria-label={v + " view"}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={"chapter-grid " + (view === "list" ? "list-view" : "")}>
        {shown.map((ch) => {
          const lessons = inChapter(ch.id),
            n = lessons.filter((c) => p.read.includes(c.id)).length;
          return (
            <a
              className="chapter-card"
              href={href("chapter/" + ch.id)}
              key={ch.id}
            >
              <div
                className="chapter-art"
                style={{ backgroundColor: ch.color }}
              >
                <Artwork chapter={ch} />
              </div>
              <div className="chapter-body">
                <div className="chapter-number mono">CHAPTER {ch.number}</div>
                <h3>{ch.name}</h3>
                <div className="card-meta">
                  <span>
                    <BookOpen size={14} />
                    {lessons.length} concepts
                  </span>
                  <span className="card-progress">
                    {n}/{lessons.length}
                  </span>
                </div>
                <Meter n={n} total={lessons.length} />
              </div>
            </a>
          );
        })}
      </div>
      {!shown.length && (
        <Empty
          icon={Sprout}
          title="No chapters here yet"
          body="Choose All chapters to explore the field guide."
        />
      )}
    </>
  );
}
