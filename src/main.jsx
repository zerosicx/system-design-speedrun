import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Menu,
  ChevronRight,
  Volume2,
  VolumeX,
  Sprout,
  CheckCircle2,
  Download,
  Monitor,
} from "lucide-react";
import { chapters, concepts, byId, randomOrder } from "./curriculum";
import { useProgress, feedback } from "./progress";
import { href, go, readRoute, nav, Modal } from "./ui";
import { Navigation, Garden } from "./Garden";
import { Lesson, ListPage } from "./study";
import { QuizRun, QuizRoom } from "./quiz";
import { StudyPlan } from "./StudyPlan";
import "./style.css";

const chapterFor = (id) => chapters.find((c) => c.id === id);
const uniqueAdd = (list, id) => (list.includes(id) ? list : [...list, id]);

function App() {
  const [route, setRoute] = useState(readRoute),
    [p, setP, stored] = useProgress();
  const [modal, setModal] = useState(""),
    [install, setInstall] = useState(null),
    [offline, setOffline] = useState(false),
    [installed, setInstalled] = useState(
      () =>
        matchMedia("(display-mode: standalone)").matches ||
        !!navigator.standalone,
    );
  const mainRef = useRef(null),
    navigated = useRef(false);
  const [quiz, setQuiz] = useState(null);
  const [path = "garden", id] = route;
  const c = path === "learn" && byId[id],
    chapter = path === "chapter" && chapterFor(id);
  const page =
    c || chapter
      ? "library"
      : path === "round"
        ? "quiz"
        : nav.some(([n]) => n === path)
          ? path
          : "garden";
  const title = nav.find(([n]) => page === n)?.[1];
  useEffect(() => {
    const change = () => {
      navigated.current = true;
      setRoute(readRoute());
      setModal("");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.title = (c?.title || chapter?.name || title) + " · Stack Garden";
    if (navigated.current) mainRef.current?.focus({ preventScroll: true });
    if (c) setP((v) => ({ ...v, last: c.id }));
  }, [path, id]);
  useEffect(() => {
    function prompt(e) {
      e.preventDefault();
      setInstall(e);
    }
    function done() {
      setInstalled(true);
      setInstall(null);
    }
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", done);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      navigator.serviceWorker
        .register("./sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then(() => setOffline(true))
        .catch(() => {});
    return () => {
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  function toggle(key) {
    const v = { ...p, [key]: !p[key] };
    feedback(v);
    setP((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function bookmark(id) {
    feedback(p);
    setP((v) => ({
      ...v,
      saved: v.saved.includes(id)
        ? v.saved.filter((k) => k !== id)
        : [...v.saved, id],
    }));
  }
  function mark(id) {
    feedback(p, "correct");
    setP((v) => ({
      ...v,
      read: uniqueAdd(v.read, id),
      last: concepts[concepts.findIndex((x) => x.id === id) + 1]?.id || id,
    }));
  }
  function shuffle() {
    feedback(p);
    const pool = concepts.filter((x) => x.id !== id && !p.read.includes(x.id));
    go(
      "learn/" +
        randomOrder(pool.length ? pool : concepts.filter((x) => x.id !== id))[0]
          .id,
    );
  }
  function answer(id, right) {
    feedback(p, right ? "correct" : "miss");
    setP((v) => ({
      ...v,
      attempts: v.attempts + 1,
      correct: v.correct + Number(right),
      missed: right
        ? v.missed.filter((k) => k !== id)
        : uniqueAdd(v.missed, id),
    }));
  }
  function start(pool) {
    if (!pool.length) return;
    feedback(p);
    setQuiz({ items: randomOrder(pool).slice(0, 5), key: crypto.randomUUID() });
    go("round");
  }
  const navProps = {
    p,
    page,
    onOpen: setModal,
    onNavigate: () => setModal(""),
  };
  return (
    <>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <Navigation {...navProps} />
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            aria-label="Open navigation"
            onClick={() => setModal("menu")}
          >
            <Menu />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <b>{title}</b>
          </div>
          <div className="top-tools">
            <button
              className="sound"
              aria-pressed={p.sound}
              onClick={() => toggle("sound")}
            >
              {p.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}Sound{" "}
              {p.sound ? "on" : "off"}
            </button>
            <i />
            <button
              className="profile"
              aria-label="Study preferences"
              onClick={() => setModal("settings")}
            >
              <img src="./art/sprout-64.png" alt="" />
            </button>
          </div>
        </header>
        <main id="main" tabIndex="-1" ref={mainRef}>
          {!stored && (
            <p role="status">
              Device storage is unavailable. Progress will last for this visit.
            </p>
          )}
          {c ? (
            <Lesson
              key={c.id}
              c={c}
              p={p}
              bookmark={bookmark}
              mark={mark}
              shuffle={shuffle}
              onAnswer={answer}
            />
          ) : chapter || path === "library" || path === "saved" ? (
            <ListPage
              key={path + (id || "")}
              kind={path}
              chapter={chapter}
              p={p}
              bookmark={bookmark}
              startQuiz={start}
            />
          ) : path === "plan" ? (
            <StudyPlan p={p} start={start} />
          ) : path === "round" && quiz ? (
            <QuizRun
              key={quiz.key}
              session={quiz.items}
              onAnswer={answer}
              start={start}
            />
          ) : page === "quiz" ? (
            <QuizRoom p={p} start={start} />
          ) : (
            <Garden p={p} shuffle={shuffle} />
          )}
        </main>
        <footer>
          <span>
            <Sprout size={15} />
            Stack Garden
          </span>
          <a
            href="https://roadmap.sh/system-design"
            rel="noreferrer"
            target="_blank"
          >
            Based on the roadmap.sh System Design Roadmap
          </a>
        </footer>
      </div>
      {modal === "menu" && (
        <Modal title="Workspace" drawer onClose={() => setModal("")}>
          <Navigation {...navProps} />
        </Modal>
      )}
      {modal === "settings" && (
        <Modal title="Study preferences" onClose={() => setModal("")}>
          {[
            [
              "sound",
              "Sound effects",
              "Soft tones for study actions and quiz answers.",
            ],
            [
              "haptics",
              "Haptic feedback",
              "Light taps on devices that support vibration.",
            ],
          ].map(([key, label, desc]) => (
            <label className="setting" key={key}>
              <span>
                <b>{label}</b>
                <small>{desc}</small>
              </span>
              <input
                type="checkbox"
                checked={p[key]}
                onChange={() => toggle(key)}
              />
            </label>
          ))}
          <p className="device-note">
            Progress and bookmarks stay in this browser on this device.
          </p>
        </Modal>
      )}
      {modal === "install" && (
        <Modal title="Install Stack Garden" onClose={() => setModal("")}>
          <p>
            Keep the field guide on your home screen for short study sessions.
          </p>
          {installed ? (
            <p className="install-state">
              <CheckCircle2 size={17} />
              Running as an installed app
            </p>
          ) : install ? (
            <button
              className="button green"
              onClick={async () => {
                await install.prompt();
                await install.userChoice;
                setInstall(null);
              }}
            >
              <Download size={16} />
              Install on this device
            </button>
          ) : (
            <div className="install-guide">
              <h3>iPhone or iPad</h3>
              <p>
                Open this site in Safari. Tap Share, then Add to Home Screen and
                Add.
              </p>
              <h3>Android</h3>
              <p>
                Open the browser menu in Chrome and select Install app or Add to
                Home screen.
              </p>
            </div>
          )}
          <div className="install-state">
            <Monitor size={17} />
            {offline
              ? "Lessons and quizzes are ready offline."
              : "Open the published app online once to save lessons for offline study."}
          </div>
        </Modal>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
