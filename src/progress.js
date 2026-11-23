import { useEffect, useState } from "react";
import { byId } from "./curriculum";

export const quizSizes = [5, 10, 20];

const key = "stack-garden-v1";
const empty = {
  read: [],
  saved: [],
  missed: [],
  correct: 0,
  quizSize: quizSizes[0],
  attempts: 0,
  last: "",
  sound: false,
  haptics: true,
};
function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    const result = { ...empty };
    for (const k of ["read", "saved", "missed"])
      result[k] = Array.isArray(data[k])
        ? [...new Set(data[k].filter((id) => byId[id]))]
        : [];
    for (const k of ["correct", "attempts"])
      result[k] = Number.isSafeInteger(data[k]) && data[k] >= 0 ? data[k] : 0;
    for (const k of ["sound", "haptics"])
      if (typeof data[k] === "boolean") result[k] = data[k];
    if (quizSizes.includes(data.quizSize)) result.quizSize = data.quizSize;
    result.last = byId[data.last] ? data.last : "";
    return result;
  } catch {
    return { ...empty };
  }
}
export function useProgress() {
  const [progress, update] = useState(restore);
  const [stored, setStored] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(progress));
      setStored(true);
    } catch {
      setStored(false);
    }
  }, [progress]);
  return [progress, update, stored];
}
let audio;
export function feedback(settings, kind = "tap") {
  if (settings.haptics)
    navigator.vibrate?.(kind === "correct" ? [18, 35, 18] : 12);
  if (!settings.sound) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    audio ||= new Audio();
    void audio.resume().catch(() => {});
    const t = audio.currentTime;
    const notes =
      kind === "correct"
        ? [523, 659, 784]
        : kind === "miss"
          ? [349, 294]
          : [523];
    notes.forEach((hz, i) => {
      const o = audio.createOscillator(),
        gain = audio.createGain(),
        start = t + i * 0.065;
      o.type = "sine";
      o.frequency.value = hz;
      o.connect(gain);
      gain.connect(audio.destination);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.055, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      o.start(start);
      o.stop(start + 0.15);
    });
  } catch {}
}
