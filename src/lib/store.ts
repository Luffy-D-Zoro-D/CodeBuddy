// CodeBuddy store — Category → Topic → Day → Files/Notes.
/* eslint-disable @typescript-eslint/no-explicit-any */
// Backed by MongoDB Atlas Data API via server functions.

import { useSyncExternalStore } from "react";
import { runMongoOp, loginFn, updateProfileFn, formatWithAIFn, inferTopicFn } from "./mongo.functions";

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

export type Asset = {
  id: string;
  dayId: string;
  filename: string;
  mimeType: string;
  data: string; // Base64 encoded data
  createdAt: string;
};

export type Feedback = {
  id: string;
  type: "bug" | "suggestion" | "other";
  message: string;
  deviceId: string;
  status: "new" | "resolved";
  createdAt: string;
  userAgent?: string;
};

export type DeviceRegistry = {
  deviceId: string;
  userAgent: string;
  createdAt: string;
};

export type StudentIdentity = {
  deviceId: string;
  name: string;
  updatedAt: string;
};

type SessionState = {
  token: string | null;
};

export type Settings = Record<string, any>;

const SESSION_KEY = "codebuddy_session_v1";
const SETTINGS_KEY = "codebuddy_settings_v1";

const DEVICE_KEY = "codebuddy_device_id_v1";

const defaultSettings: Settings = {};

const now = () => new Date().toISOString();

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server-side";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = uid("dev");
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

// Hardcoded categories (could be moved to DB later, but perfectly fine locally for now)
const CATEGORIES: Category[] = [
  { id: "c-html", name: "HTML", slug: "html", displayOrder: 1 },
  { id: "c-css", name: "CSS", slug: "css", displayOrder: 2 },
  { id: "c-js", name: "JavaScript", slug: "javascript", displayOrder: 3 },
];

// ---------- persistence + reactivity ----------

const listeners = new Set<() => void>();
let sessionCache: SessionState | null = null;

function loadSession(): SessionState {
  if (sessionCache) return sessionCache;
  if (typeof window === "undefined") return { token: null };
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      sessionCache = { token: null };
      return sessionCache;
    }
    sessionCache = JSON.parse(raw) as SessionState;
    return sessionCache;
  } catch {
    sessionCache = { token: null };
    return sessionCache;
  }
}

let snapshotVersion = 0;
function commitSession(state: SessionState) {
  sessionCache = state;
  if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  snapshotVersion++;
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  loadSession();
  return snapshotVersion;
}
function getServerSnapshot() {
  return 0;
}

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
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || uid("s")
  );
}

function getToken() {
  return loadSession().token ?? undefined;
}

// ---------- API ----------

export const api = {
  // auth
  async login(username: string, password: string) {
    const res = await loginFn({ data: { username, password } });
    commitSession({ token: res.token });
    return { token: res.token };
  },
  async logout() {
    commitSession({ token: null });
  },
  isAuthed() {
    if (typeof window === "undefined") return false;
    return !!loadSession().token;
  },
  async updateProfile(newUsername: string, newPassword?: string) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    const res = await updateProfileFn({ data: { token, newUsername, newPassword } });
    if (res.token) {
      commitSession({ token: res.token });
    }
  },
  getUsername() {
    const token = getToken();
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload.username as string;
    } catch {
      return null;
    }
  },
  getRole() {
    const token = getToken();
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload.role as string;
    } catch {
      return null;
    }
  },
  async getUserPreferences(): Promise<{ lastCatId?: string; lastTopicId?: string; lastDayId?: string; lastFileId?: string } | null> {
    const username = this.getUsername();
    if (!username) return null;
    try {
      const res = (await runMongoOp({
        data: { token: getToken(), collection: "preferences", action: "findOne", body: { filter: { id: username } } },
      })) as any;
      return res.document || null;
    } catch {
      return null;
    }
  },
  async updateUserPreferences(prefs: { lastCatId?: string; lastTopicId?: string; lastDayId?: string; lastFileId?: string }): Promise<void> {
    const username = this.getUsername();
    if (!username) return;
    try {
      await runMongoOp({
        data: {
          token: getToken(),
          collection: "preferences",
          action: "updateOne",
          body: {
            filter: { id: username },
            update: { $set: prefs },
            upsert: true,
          },
        },
      });
    } catch (e) {
      console.error("Failed to update preferences", e);
    }
  },

  // categories
  async listCategories(): Promise<Category[]> {
    return [...CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return CATEGORIES.find((c) => c.slug === slug);
  },

  // topics
  async listTopics(categoryId?: string): Promise<Topic[]> {
    const filter = categoryId ? { categoryId } : {};
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "topics", action: "find", body: { filter } },
    })) as any;
    const docs = (res.documents || []) as Topic[];
    return docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getTopic(categorySlug: string, topicSlug: string): Promise<Topic | undefined> {
    const cat = await this.getCategoryBySlug(categorySlug);
    if (!cat) return undefined;

    const res = (await runMongoOp({
      data: {
        token: getToken(),
        collection: "topics",
        action: "findOne",
        body: { filter: { categoryId: cat.id, slug: topicSlug } },
      },
    })) as any;
    return res.document as Topic | undefined;
  },
  async createTopic(input: {
    categoryId: string;
    title: string;
    description?: string;
  }): Promise<Topic> {
    const t: Topic = {
      id: uid("t"),
      categoryId: input.categoryId,
      title: input.title,
      slug: slugify(input.title),
      description: input.description,
      createdAt: now(),
      updatedAt: now(),
    };

    await runMongoOp({
      data: { token: getToken(), collection: "topics", action: "insertOne", body: { document: t } },
    });
    return t;
  },
  async inferTopic(
    categoryName: string,
    existingTopics: { id: string; title: string }[],
    fileContentsPreview: string,
    currentTopicId: string | null
  ) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    const res = await inferTopicFn({ data: { token, categoryName, existingTopics, fileContentsPreview, currentTopicId } });
    return res.result as {
      action: "use_existing" | "create_new";
      topicId?: string;
      topicName?: string;
      dayTitle: string;
    };
  },
  async updateTopic(
    id: string,
    patch: Partial<Pick<Topic, "title" | "description">>,
  ): Promise<void> {
    const updatedAt = now();
    const updatePayload: any = { updatedAt, ...patch };
    if (patch.title) updatePayload.slug = slugify(patch.title);

    await runMongoOp({
      data: {
        token: getToken(),
        collection: "topics",
        action: "updateOne",
        body: { filter: { id }, update: { $set: updatePayload } },
      },
    });
  },
  async deleteTopic(id: string): Promise<void> {
    const token = getToken();
    await runMongoOp({
      data: { token, collection: "topics", action: "deleteOne", body: { filter: { id } } },
    });
    const daysRes = (await runMongoOp({
      data: { token, collection: "days", action: "find", body: { filter: { topicId: id } } },
    })) as any;
    const dayIds = (daysRes.documents || []).map((d: any) => d.id);
    if (dayIds.length > 0) {
      await runMongoOp({
        data: {
          token,
          collection: "days",
          action: "deleteMany",
          body: { filter: { topicId: id } },
        },
      });
      await runMongoOp({
        data: {
          token,
          collection: "files",
          action: "deleteMany",
          body: { filter: { dayId: { $in: dayIds } } },
        },
      });
    }
  },

  // days
  async listDays(topicId: string): Promise<Day[]> {
    const res = (await runMongoOp({
      data: {
        token: getToken(),
        collection: "days",
        action: "find",
        body: { filter: { topicId } },
      },
    })) as any;
    const docs = (res.documents || []) as Day[];
    return docs.sort((a, b) => b.dayNumber - a.dayNumber);
  },
  async listRecentDays(limit = 3): Promise<Day[]> {
    const res = (await runMongoOp({
      data: {
        token: getToken(),
        collection: "days",
        action: "find",
        body: { filter: {}, sort: { createdAt: -1 }, limit },
      },
    })) as any;
    return (res.documents || []) as Day[];
  },
  async getDay(topicId: string, dayNumber: number): Promise<Day | undefined> {
    const res = (await runMongoOp({
      data: {
        token: getToken(),
        collection: "days",
        action: "findOne",
        body: { filter: { topicId, dayNumber } },
      },
    })) as any;
    return res.document as Day | undefined;
  },
  async createDay(input: { topicId: string; title?: string; note?: string }): Promise<Day> {
    const token = getToken();
    let nextNumber = 1;
    try {
      const res = await runMongoOp({
        data: {
          token,
          collection: "days",
          action: "find",
          body: { filter: {}, sort: { dayNumber: -1 }, limit: 1 },
        },
      });
      if (res && res.documents && res.documents.length > 0) {
        nextNumber = res.documents[0].dayNumber + 1;
      }
    } catch (err) {
      console.error("Failed to find global max day", err);
    }

    const d: Day = {
      id: uid("d"),
      topicId: input.topicId,
      dayNumber: nextNumber,
      title: input.title,
      note: input.note,
      createdAt: now(),
      updatedAt: now(),
    };

    await runMongoOp({
      data: { token, collection: "days", action: "insertOne", body: { document: d } },
    });
    await runMongoOp({
      data: {
        token,
        collection: "topics",
        action: "updateOne",
        body: { filter: { id: input.topicId }, update: { $set: { updatedAt: now() } } },
      },
    });

    return d;
  },
  async updateDay(id: string, patch: Partial<Pick<Day, "title" | "note">>): Promise<void> {
    const updatePayload = { ...patch, updatedAt: now() };
    await runMongoOp({
      data: {
        token: getToken(),
        collection: "days",
        action: "updateOne",
        body: { filter: { id }, update: { $set: updatePayload } },
      },
    });
  },
  async deleteDay(id: string): Promise<void> {
    const token = getToken();
    await runMongoOp({
      data: { token, collection: "days", action: "deleteOne", body: { filter: { id } } },
    });
    await runMongoOp({
      data: { token, collection: "files", action: "deleteMany", body: { filter: { dayId: id } } },
    });
  },

  // files
  async listFiles(dayId: string): Promise<CodeFile[]> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "files", action: "find", body: { filter: { dayId } } },
    })) as any;
    const docs = (res.documents || []) as CodeFile[];
    return docs.sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async createFile(
    input: Omit<CodeFile, "id" | "displayOrder"> & { displayOrder?: number },
  ): Promise<CodeFile> {
    let order = input.displayOrder;

    if (!order) {
      const files = await this.listFiles(input.dayId);
      order = files.length + 1;
    }

    const f: CodeFile = {
      ...input,
      id: uid("f"),
      displayOrder: order,
    };

    const token = getToken();
    await runMongoOp({
      data: { token, collection: "files", action: "insertOne", body: { document: f } },
    });
    const dayRes = (await runMongoOp({
      data: {
        token: getToken(),
        collection: "days",
        action: "findOne",
        body: { filter: { id: input.dayId } },
      },
    })) as any;
    if (dayRes.document) {
      await runMongoOp({
        data: {
          token,
          collection: "days",
          action: "updateOne",
          body: { filter: { id: input.dayId }, update: { $set: { updatedAt: now() } } },
        },
      });
    }

    return f;
  },
  async updateFile(
    id: string,
    patch: Partial<Pick<CodeFile, "content" | "displayName" | "language" | "aiNote">>,
  ): Promise<void> {
    await runMongoOp({
      data: {
        token: getToken(),
        collection: "files",
        action: "updateOne",
        body: { filter: { id }, update: { $set: patch } },
      },
    });
  },
  async deleteFile(id: string): Promise<void> {
    await runMongoOp({
      data: { token: getToken(), collection: "files", action: "deleteOne", body: { filter: { id } } },
    });
  },

  // assets
  async listAssets(dayId: string): Promise<Asset[]> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "assets", action: "find", body: { filter: { dayId }, projection: { data: 0 } } }, // exclude data for listing to save bandwidth
    })) as any;
    return (res.documents || []) as Asset[];
  },
  async getAsset(id: string): Promise<Asset | undefined> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "assets", action: "findOne", body: { filter: { id } } },
    })) as any;
    return res.document as Asset | undefined;
  },
  async createAsset(input: Omit<Asset, "id" | "createdAt">): Promise<Asset> {
    const a: Asset = {
      ...input,
      id: uid("a"),
      createdAt: now(),
    };
    await runMongoOp({
      data: { token: getToken(), collection: "assets", action: "insertOne", body: { document: a } },
    });
    return a;
  },
  async deleteAsset(id: string): Promise<void> {
    await runMongoOp({
      data: { token: getToken(), collection: "assets", action: "deleteOne", body: { filter: { id } } },
    });
  },

  // feedback
  async submitFeedback(type: "bug" | "suggestion" | "other", message: string): Promise<void> {
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : "Unknown";
    const f: Feedback = {
      id: uid("fb"),
      type,
      message,
      deviceId: getDeviceId(),
      status: "new",
      createdAt: now(),
      userAgent,
    };
    await runMongoOp({
      data: { token: getToken(), collection: "feedback", action: "insertOne", body: { document: f } },
    });
  },
  async listFeedback(): Promise<Feedback[]> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "feedback", action: "find" },
    })) as any;
    const docs = (res.documents || []) as Feedback[];
    return docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async resolveFeedback(id: string): Promise<void> {
    await runMongoOp({
      data: { token: getToken(), collection: "feedback", action: "updateOne", body: { filter: { id }, update: { $set: { status: "resolved" } } } },
    });
  },
  async deleteFeedback(id: string): Promise<void> {
    await runMongoOp({
      data: { token: getToken(), collection: "feedback", action: "deleteOne", body: { filter: { id } } },
    });
  },

  // global settings and identities
  async getGlobalSettings(): Promise<{ requireStudentNames: boolean, lockdownMode: boolean, bannedDevices: string[] }> {
    const res = (await runMongoOp({
      data: { collection: "global_settings", action: "findOne", body: { filter: { id: "app_settings" } } },
    })) as any;
    return res.document || { requireStudentNames: false, lockdownMode: false, bannedDevices: [] };
  },
  async updateGlobalSettings(patch: Partial<{ requireStudentNames: boolean, lockdownMode: boolean, bannedDevices: string[] }>): Promise<void> {
    await runMongoOp({
      data: { 
        token: getToken(), 
        collection: "global_settings", 
        action: "updateOne", 
        body: { filter: { id: "app_settings" }, update: { $set: patch }, upsert: true } 
      },
    });
  },
  async banDevice(deviceId: string): Promise<void> {
    if (!deviceId) return;
    await runMongoOp({
      data: { 
        token: getToken(), 
        collection: "global_settings", 
        action: "updateOne", 
        body: { filter: { id: "app_settings" }, update: { $addToSet: { bannedDevices: deviceId } }, upsert: true } 
      },
    });
  },
  async unbanDevice(deviceId: string): Promise<void> {
    if (!deviceId) return;
    await runMongoOp({
      data: { 
        token: getToken(), 
        collection: "global_settings", 
        action: "updateOne", 
        body: { filter: { id: "app_settings" }, update: { $pull: { bannedDevices: deviceId } } } 
      },
    });
  },
  async submitStudentIdentity(name: string, deviceId: string): Promise<void> {
    await runMongoOp({
      data: { 
        collection: "student_identities", 
        action: "updateOne", 
        body: { filter: { deviceId }, update: { $set: { name, updatedAt: now() } }, upsert: true } 
      },
    });
  },
  async listStudentIdentities(): Promise<StudentIdentity[]> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "student_identities", action: "find" },
    })) as any;
    return (res.documents || []) as StudentIdentity[];
  },
  async checkIfRegistered(deviceId: string): Promise<boolean> {
    if (!deviceId) return false;
    const res = (await runMongoOp({
      data: { collection: "student_identities", action: "findOne", body: { filter: { deviceId } } },
    })) as any;
    return !!res.document;
  },
  async registerDeviceSilent(deviceId: string, userAgent: string): Promise<void> {
    if (!deviceId) return;
    await runMongoOp({
      data: {
        collection: "device_registry",
        action: "updateOne",
        body: { 
          filter: { deviceId }, 
          update: { $setOnInsert: { deviceId, userAgent, createdAt: now() } }, 
          upsert: true 
        }
      }
    });
  },
  async listDeviceRegistry(): Promise<DeviceRegistry[]> {
    const res = (await runMongoOp({
      data: { token: getToken(), collection: "device_registry", action: "find" }
    })) as any;
    return (res.documents || []) as DeviceRegistry[];
  },

  // search across topics + days
  async search(q: string) {
    const query = q.trim().toLowerCase();
    if (!query) return { topics: [] as Array<Topic & { categorySlug: string }> };

    const categories = await this.listCategories();
    const catById = new Map(categories.map((c) => [c.id, c]));

    const res = (await runMongoOp({
      data: { token: getToken(), collection: "topics", action: "find", body: {} },
    })) as any;
    const allTopics = (res.documents || []) as Topic[];

    const topics = allTopics
      .filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description ?? "").toLowerCase().includes(query),
      )
      .map((t) => ({ ...t, categorySlug: catById.get(t.categoryId)?.slug ?? "" }));

    return { topics };
  },

  // AI formatting via Groq
  // AI formatting via Groq (Server Side)
  async formatWithAI(code: string, language: string, aiNote?: string): Promise<string> {
    const token = getToken();
    if (!token) {
      if (language === "javascript" || language === "css") {
        return code
          .replace(/;\s*(?=\S)/g, ";\n")
          .replace(/\{\s*/g, " {\n")
          .replace(/\s*\}/g, "\n}")
          .replace(/\n{3,}/g, "\n\n");
      }
      return code;
    }

    const res = await formatWithAIFn({ data: { token, code, language, aiNote } });
    return res.formattedCode;
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
