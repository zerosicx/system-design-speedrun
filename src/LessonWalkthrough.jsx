import React, { useState } from "react";
import {
  Archive,
  Bell,
  BookOpen,
  Database,
  FileText,
  Folder,
  HardDrive,
  Layers,
  Mail,
  Monitor,
  Network,
  Server,
  Smartphone,
  User,
  Users,
} from "lucide-react";

const landmarks = [
  [/\b(phone|mobile)\b/i, Smartphone],
  [/\b(cache|redis)\b/i, Layers],
  [/\b(database|postgresql|table|replica|shard|ledger)\b/i, Database],
  [/\b(queue|inbox|buffer)\b/i, Archive],
  [/\b(browser|screen|app|dashboard)\b/i, Monitor],
  [/\b(server|worker|service|api|gateway)\b/i, Server],
  [/\b(router|balancer|network|dns)\b/i, Network],
  [/\b(file|ticket|receipt|report|document)\b/i, FileText],
  [/\b(disk|backup|storage)\b/i, HardDrive],
  [/\b(folder|bucket)\b/i, Folder],
  [/\b(email|message)\b/i, Mail],
  [/\b(alert|alarm)\b/i, Bell],
  [/\b(team|customers|readers)\b/i, Users],
  [/\b(customer|visitor|reader|buyer|user|editor|cashier)\b/i, User],
];

function Landmark({ name, position }) {
  const Icon = landmarks.find(([pattern]) => pattern.test(name))?.[1];
  return (
    <div className={"landmark " + position}>
      {Icon && <Icon size={24} aria-hidden="true" />}
      <strong>{name}</strong>
    </div>
  );
}

function FlowDiagram({ steps, index }) {
  const frame = steps[index];
  // Keep a returning reply pointed back to the participant that sent the request.
  const order = steps.flatMap((step) => [step.from, step.to]);
  const reverse = order.indexOf(frame.from) > order.indexOf(frame.to);
  return (
    <div
      className="walk-flow"
      role="img"
      aria-label={`${frame.from} to ${frame.to}: ${frame.label}`}
    >
      <Landmark position="left" name={reverse ? frame.to : frame.from} />
      <span className="walk-label">{frame.label}</span>
      <span
        className={"walk-wire" + (reverse ? " reverse" : "")}
        aria-hidden="true"
      />
      <Landmark position="right" name={reverse ? frame.from : frame.to} />
    </div>
  );
}

// Show the other destination as well when choosing a route is the lesson.
function ForkDiagram({ fork, frame }) {
  const edgeClass = (from, to) =>
    from === frame.from && to === frame.to ? "current-edge" : "";
  const [first, second] = fork.branches;
  const node = (name) => (
    <Landmark name={name} position={name === frame.to ? "current-node" : ""} />
  );
  return (
    <div
      className="walk-fork"
      role="img"
      aria-label={`${frame.from} to ${frame.to}: ${frame.label}`}
    >
      {node(fork.entry)}
      <svg className="fork-trunk" viewBox="0 0 40 26" aria-hidden="true">
        <path
          className={edgeClass(fork.entry, fork.hub)}
          d="M20 1V23 M15 17L20 23L25 17"
        />
      </svg>
      {node(fork.hub)}
      <svg
        className="fork-edges"
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={edgeClass(fork.hub, first)}
          d="M50 0V12H25V33 M23 27L25 33L27 27"
        />
        <path
          className={edgeClass(fork.hub, second)}
          d="M50 0V12H75V33 M73 27L75 33L77 27"
        />
      </svg>
      <div className="fork-destinations">
        {node(first)}
        {node(second)}
      </div>
      <p className="fork-transfer">
        {frame.from} → {frame.to} · {frame.label}
      </p>
    </div>
  );
}

function ConnectionPool({ limited }) {
  return (
    <figure className="connection-pool">
      <figcaption>Four shared database connections</figcaption>
      <ol>
        {[0, 1, 2, 3].map((i) => {
          const profile = limited && i === 3;
          const Icon = profile ? User : FileText;
          return (
            <li key={i} className={profile ? "available-for-profile" : ""}>
              <Icon size={23} aria-hidden="true" />
              {profile ? "Jo’s profile" : "Sam’s export"}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export function LessonWalkthrough({ lesson }) {
  const [index, setIndex] = useState(0);
  const { steps } = lesson.story;
  const capacity = lesson.id === "systems-noisy-neighbor";
  return (
    <section
      className="lesson-walk"
      aria-label={capacity ? "Try a fix" : "Follow the example"}
    >
      <div className="walk-top">
        <strong>{capacity ? "Try a fix" : "Follow the example"}</strong>
        {!capacity && (
          <span>
            Step {index + 1} of {steps.length}
          </span>
        )}
      </div>
      {capacity && (
        <div
          className="walk-controls"
          role="group"
          aria-label="Export connection limit"
        >
          {["No export limit", "Limit export to 3"].map((label, i) => (
            <button
              type="button"
              key={label}
              className="button light"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div aria-live="polite" aria-atomic="true">
        {capacity ? (
          <ConnectionPool limited={index === 1} />
        ) : lesson.story.fork ? (
          <ForkDiagram fork={lesson.story.fork} frame={steps[index]} />
        ) : (
          <FlowDiagram steps={steps} index={index} />
        )}
        <p className="walk-caption">{steps[index].caption}</p>
      </div>
      {!capacity && (
        <div className="walk-controls">
          <button
            type="button"
            className="button light"
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="button green"
            onClick={() => setIndex((index + 1) % steps.length)}
          >
            {index === steps.length - 1 ? "Read again" : "Next step"}
          </button>
        </div>
      )}
    </section>
  );
}

export function StoryNotes({ lesson }) {
  return (
    <article className="panel reading">
      <p className="story-intro">{lesson.story.intro}</p>
      <p className="story-meaning">{lesson.story.meaning}</p>
      <LessonWalkthrough lesson={lesson} />
      <p className="story-tech">
        <strong>Where you’ll see this.</strong> {lesson.story.technology}
      </p>
      <details className="more-notes">
        <summary>
          <BookOpen size={17} aria-hidden="true" /> Read the technical
          explanation
        </summary>
        <p>{lesson.lesson}</p>
        <p>{lesson.detail}</p>
        <p>
          <strong>In practice.</strong> {lesson.example}
        </p>
      </details>
      <section className="lesson-terms" aria-label="Key terms">
        <h2>Key terms</h2>
        <dl>
          {lesson.terms.map(({ term, definition }) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{definition}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
