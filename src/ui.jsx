import React, { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Layers3,
  Bookmark,
  Clock3,
  X,
} from "lucide-react";

export const nav = [
  ["garden", "Study garden", LayoutDashboard],
  ["library", "Concept index", BookOpen],
  ["quiz", "Quiz room", Layers3],
  ["saved", "Bookmarks", Bookmark],
  ["plan", "Speedrun plan", Clock3],
];
export const href = (path = "garden") => "#/" + path;
export const go = (path) => {
  location.hash = href(path);
};
export function readRoute() {
  return location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}
export const percentage = (n, total) =>
  total ? Math.round((n / total) * 100) : 0;
export const join = (...s) => s.filter(Boolean).join(" ");

export function Meter({ n, total }) {
  return (
    <div
      className="meter"
      role="progressbar"
      aria-label="Study progress"
      aria-valuenow={n}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <i style={{ width: percentage(n, total) + "%" }} />
    </div>
  );
}
export function Modal({ title, onClose, children, drawer = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={drawer ? "drawer" : "dialog"}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog-body">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Empty({ icon: Icon, title, body }) {
  return (
    <div className="empty">
      <Icon size={30} />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
