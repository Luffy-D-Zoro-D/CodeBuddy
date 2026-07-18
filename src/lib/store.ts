// CodeClass local store — Category → Topic → Day → Files/Notes.
// Persisted in localStorage. Reactive via subscribe(): components that read
// through `useStore()` re-render on any mutation so counts stay in sync.
//
// MongoDB: the browser cannot open TCP connections to Atlas. The MongoDB URI
// saved in Settings is intended for the user's external Express backend
// (documented in the original PRD). When VITE_API_URL is set, this module
// could be swapped for a fetch-based client; the local store keeps the app
// fully usable in the meantime.

import { useSyncExternalStore } from "react";

export type Category = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
};

export type Topic = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Day = {
  id: string;
  topicId: string;
  dayNumber: number;
  title?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type CodeFile = {
  id: string;
  dayId: string;
  filename: string;
  displayName: string;
  language: "html" | "css" | "javascript" | "text";
  content: string;
  displayOrder: number;
  aiNote?: string;
};

type DB = {
  categories: Category[];
  topics: Topic[];
  days: Day[];
  files: CodeFile[];
  admin: { username: string; password: string };
  session: { token: string | null };
};

export type Settings = {
  mongoUri: string;
  groqApiKey: string;
  groqModel: string;
};

const KEY = "codeclass_db_v2";
const SETTINGS_KEY = "codeclass_settings_v1";

const defaultSettings: Settings = {
  mongoUri: "",
  groqApiKey: "",
  groqModel: "llama-3.3-70b-versatile",
};

const now = () => new Date().toISOString();

const seed: DB = {
  admin: { username: "admin", password: "admin" },
  session: { token: null },
  categories: [
    { id: "c-html", name: "HTML", slug: "html", displayOrder: 1 },
    { id: "c-css", name: "CSS", slug: "css", displayOrder: 2 },
    { id: "c-js", name: "JavaScript", slug: "javascript", displayOrder: 3 },
  ],
  topics: [
    {
      id: "t-positions",
      categoryId: "c-css",
      title: "Positions in CSS",
      slug: "positions-in-css",
      description: "static, relative, absolute, fixed, sticky.",
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "t-forms",
      categoryId: "c-html",
      title: "Forms",
      slug: "forms",
      description: "Inputs, labels, and validation attributes.",
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
      updatedAt: new Date(Date.now() - 86400_000).toISOString(),
    },
  ],
  days: [
    {
      id: "d-pos-1",
      topicId: "t-positions",
      dayNumber: 1,
      title: "Intro & static / relative",
      note: "Covered the default flow and how relative offsets keep space.",
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: "d-forms-1",
      topicId: "t-forms",
      dayNumber: 1,
      title: "Registration form",
      note: "Built a simple sign-up form with client-side validation attributes.",
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
      updatedAt: new Date(Date.now() - 86400_000).toISOString(),
    },
  ],
  files: [
    {
      id: "f-pos-html",
      dayId: "d-pos-1",
      filename: "index.html",
      displayName: "index.html",
      language: "html",
      displayOrder: 1,
      content: `<div class="box relative">Relative</div>\n<div class="box">Static (normal flow)</div>`,
    },
    {
      id: "f-pos-css",
      dayId: "d-pos-1",
      filename: "style.css",
      displayName: "style.css",
      language: "css",
      displayOrder: 2,
      content: `.box { padding: 1rem; margin: 0.5rem 0; background: #f5f5f7; }\n.relative { position: relative; top: 8px; left: 12px; }`,
    },
    {
      id: "f-forms-html",
      dayId: "d-forms-1",
      filename: "index.html",
      displayName: "index.html",
      language: "html",
      displayOrder: 1,
      content: `<form>\n  <label>Email <input type="email" required /></label>\n  <label>Password <input type="password" minlength="8" required /></label>\n  <button type="submit">Sign up</button>\n</form>`,
    },
  ],
};

// ---------- persistence + reactivity ----------

const listeners = new Set<() => void>();
let cache: DB | null = null;

function load(): DB {
  if (cache) return cache;
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cache = structuredClone(seed);
      localStorage.setItem(KEY, JSON.stringify(cache));
      return cache;
    }
    cache = JSON.parse(raw) as DB;
    return cache;
  } catch {
    cache = structuredClone(seed);
    return cache;
  }
}

let snapshotVersion = 0;
function commit(db: DB) {
  cache = db;
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(db));
  snapshotVersion++;
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  load();
  return snapshotVersion;
}
function getServerSnapshot() {
  return 0;
}

/** Subscribe a component to store changes; returns a version number. */
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}
function saveSettings(s: Settings) {
  if (typeof window !== "undefined") localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || uid("s");
}

// ---------- API ----------

export const api = {
  // auth
  login(username: string, password: string) {
    const db = load();
    if (username === db.admin.username && password === db.admin.password) {
      const next = { ...db, session: { token: "demo-token-" + Date.now() } };
      commit(next);
      return { token: next.session.token };
    }
    throw new Error("Invalid credentials");
  },
  logout() {
    const db = load();
    commit({ ...db, session: { token: null } });
  },
  isAuthed() {
    if (typeof window === "undefined") return false;
    return !!load().session.token;
  },

  // categories
  listCategories(): Category[] {
    return [...load().categories].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getCategoryBySlug(slug: string) {
    return load().categories.find((c) => c.slug === slug);
  },

  // topics
  listTopics(categoryId?: string): Topic[] {
    const db = load();
    const rows = categoryId ? db.topics.filter((t) => t.categoryId === categoryId) : db.topics;
    // newest topic first
    return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  getTopic(categorySlug: string, topicSlug: string) {
    const db = load();
    const cat = db.categories.find((c) => c.slug === categorySlug);
    if (!cat) return undefined;
    return db.topics.find((t) => t.categoryId === cat.id && t.slug === topicSlug);
  },
  createTopic(input: { categoryId: string; title: string; description?: string }): Topic {
    const db = load();
    const t: Topic = {
      id: uid("t"),
      categoryId: input.categoryId,
      title: input.title,
      slug: slugify(input.title),
      description: input.description,
      createdAt: now(),
      updatedAt: now(),
    };
    commit({ ...db, topics: [...db.topics, t] });
    return t;
  },
  updateTopic(id: string, patch: Partial<Pick<Topic, "title" | "description">>) {
    const db = load();
    const topics = db.topics.map((t) => {
      if (t.id !== id) return t;
      const title = patch.title ?? t.title;
      return {
        ...t,
        title,
        slug: patch.title ? slugify(patch.title) : t.slug,
        description: patch.description ?? t.description,
        updatedAt: now(),
      };
    });
    commit({ ...db, topics });
  },
  deleteTopic(id: string) {
    const db = load();
    const dayIds = new Set(db.days.filter((d) => d.topicId === id).map((d) => d.id));
    commit({
      ...db,
      topics: db.topics.filter((t) => t.id !== id),
      days: db.days.filter((d) => d.topicId !== id),
      files: db.files.filter((f) => !dayIds.has(f.dayId)),
    });
  },

  // days
  listDays(topicId: string): Day[] {
    // newest (highest dayNumber) first
    return [...load().days.filter((d) => d.topicId === topicId)].sort(
      (a, b) => b.dayNumber - a.dayNumber,
    );
  },
  getDay(topicId: string, dayNumber: number) {
    return load().days.find((d) => d.topicId === topicId && d.dayNumber === dayNumber);
  },
  createDay(input: { topicId: string; title?: string; note?: string }): Day {
    const db = load();
    const nextNumber =
      db.days.filter((d) => d.topicId === input.topicId).reduce((max, d) => Math.max(max, d.dayNumber), 0) + 1;
    const d: Day = {
      id: uid("d"),
      topicId: input.topicId,
      dayNumber: nextNumber,
      title: input.title,
      note: input.note,
      createdAt: now(),
      updatedAt: now(),
    };
    const topics = db.topics.map((t) => (t.id === input.topicId ? { ...t, updatedAt: now() } : t));
    commit({ ...db, days: [...db.days, d], topics });
    return d;
  },
  updateDay(id: string, patch: Partial<Pick<Day, "title" | "note">>) {
    const db = load();
    const days = db.days.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: now() } : d));
    commit({ ...db, days });
  },
  deleteDay(id: string) {
    const db = load();
    commit({
      ...db,
      days: db.days.filter((d) => d.id !== id),
      files: db.files.filter((f) => f.dayId !== id),
    });
  },

  // files
  listFiles(dayId: string): CodeFile[] {
    return [...load().files.filter((f) => f.dayId === dayId)].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
  },
  createFile(input: Omit<CodeFile, "id" | "displayOrder"> & { displayOrder?: number }): CodeFile {
    const db = load();
    const f: CodeFile = {
      ...input,
      id: uid("f"),
      displayOrder:
        input.displayOrder ?? db.files.filter((x) => x.dayId === input.dayId).length + 1,
    };
    const day = db.days.find((d) => d.id === input.dayId);
    const days = day ? db.days.map((d) => (d.id === day.id ? { ...d, updatedAt: now() } : d)) : db.days;
    commit({ ...db, files: [...db.files, f], days });
    return f;
  },
  updateFile(id: string, patch: Partial<Pick<CodeFile, "content" | "displayName" | "language" | "aiNote">>) {
    const db = load();
    const files = db.files.map((f) => (f.id === id ? { ...f, ...patch } : f));
    const target = db.files.find((f) => f.id === id);
    const days = target
      ? db.days.map((d) => (d.id === target.dayId ? { ...d, updatedAt: now() } : d))
      : db.days;
    commit({ ...db, files, days });
  },
  deleteFile(id: string) {
    const db = load();
    commit({ ...db, files: db.files.filter((f) => f.id !== id) });
  },

  // search across topics + days
  search(q: string) {
    const query = q.trim().toLowerCase();
    const db = load();
    if (!query) return { topics: [] as Array<Topic & { categorySlug: string }> };
    const catById = new Map(db.categories.map((c) => [c.id, c]));
    const topics = db.topics
      .filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description ?? "").toLowerCase().includes(query),
      )
      .map((t) => ({ ...t, categorySlug: catById.get(t.categoryId)?.slug ?? "" }));
    return { topics };
  },

  // AI formatting via Groq
  async formatWithAI(code: string, language: string, aiNote?: string): Promise<string> {
    const s = loadSettings();
    if (!s.groqApiKey) {
      // Local fallback
      if (language === "javascript" || language === "css") {
        return code
          .replace(/;\s*(?=\S)/g, ";\n")
          .replace(/\{\s*/g, " {\n")
          .replace(/\s*\}/g, "\n}")
          .replace(/\n{3,}/g, "\n\n");
      }
      return code;
    }
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${s.groqApiKey}`,
      },
      body: JSON.stringify({
        model: s.groqModel || "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You are a code formatter. Reformat the user's code with clean, consistent 2-space indentation and idiomatic style. Do NOT change behavior. Reply with ONLY the formatted code, no markdown fences. If the user provides an 'AI note' describing intent, use it only to understand context — do not embed the note in the output.",
          },
          {
            role: "user",
            content: `Language: ${language}${aiNote ? `\nAI note (context): ${aiNote}` : ""}\n\n${code}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    let out: string = data.choices?.[0]?.message?.content ?? code;
    out = out.replace(/^```[a-zA-Z]*\n?/, "").replace(/```\s*$/, "").trim();
    return out;
  },

  // settings
  getSettings(): Settings {
    return loadSettings();
  },
  setSettings(patch: Partial<Settings>) {
    const next = { ...loadSettings(), ...patch };
    saveSettings(next);
    return next;
  },
};