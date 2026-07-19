import { c as createServerFn, i as TSS_SERVER_FUNCTION, y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DTkCA_w1.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BioVMgnH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var runMongoOp = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("a427d4ce07bc4ec7dfcaf6759e20b212debe2a5d35b0701b86c82d389cf93d4d"));
var loginFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("1c70a3bf92c4471161c55b3cebc48bb1987d7a4486b77b1c7cd2d8341a452223"));
var changePasswordFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("c2c155a164c1ef85b4c7104242ed1f73b833d617889398c34f42a7b833b68ef9"));
var formatWithAIFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("98f6bb01025ff4d7d825c0ef467514953a53c98914af96457ec94faff4c56ba2"));
var SESSION_KEY = "codebuddy_session_v1";
var SETTINGS_KEY = "codebuddy_settings_v1";
var defaultSettings = {};
var now = () => (/* @__PURE__ */ new Date()).toISOString();
var CATEGORIES = [
	{
		id: "c-html",
		name: "HTML",
		slug: "html",
		displayOrder: 1
	},
	{
		id: "c-css",
		name: "CSS",
		slug: "css",
		displayOrder: 2
	},
	{
		id: "c-js",
		name: "JavaScript",
		slug: "javascript",
		displayOrder: 3
	}
];
var listeners = /* @__PURE__ */ new Set();
var sessionCache = null;
function loadSession() {
	if (sessionCache) return sessionCache;
	if (typeof window === "undefined") return { token: null };
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) {
			sessionCache = { token: null };
			return sessionCache;
		}
		sessionCache = JSON.parse(raw);
		return sessionCache;
	} catch {
		sessionCache = { token: null };
		return sessionCache;
	}
}
var snapshotVersion = 0;
function commitSession(state) {
	sessionCache = state;
	if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, JSON.stringify(state));
	snapshotVersion++;
	listeners.forEach((l) => l());
}
function subscribe(cb) {
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
function useStore() {
	return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
}
function loadSettings() {
	if (typeof window === "undefined") return defaultSettings;
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return { ...defaultSettings };
		return {
			...defaultSettings,
			...JSON.parse(raw)
		};
	} catch {
		return { ...defaultSettings };
	}
}
function saveSettings(s) {
	if (typeof window !== "undefined") localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || uid("s");
}
function getToken() {
	return loadSession().token ?? void 0;
}
var api = {
	async login(username, password) {
		const res = await loginFn({ data: {
			username,
			password
		} });
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
	async changePassword(newPassword) {
		const token = getToken();
		if (!token) throw new Error("Not logged in");
		await changePasswordFn({ data: {
			token,
			newPassword
		} });
	},
	getUsername() {
		const token = getToken();
		if (!token) return null;
		try {
			const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
			return JSON.parse(atob(base64)).username;
		} catch {
			return null;
		}
	},
	async listCategories() {
		return [...CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
	},
	async getCategoryBySlug(slug) {
		return CATEGORIES.find((c) => c.slug === slug);
	},
	async listTopics(categoryId) {
		const filter = categoryId ? { categoryId } : {};
		return ((await runMongoOp({ data: {
			token: getToken(),
			collection: "topics",
			action: "find",
			body: { filter }
		} })).documents || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},
	async getTopic(categorySlug, topicSlug) {
		const cat = await this.getCategoryBySlug(categorySlug);
		if (!cat) return void 0;
		return (await runMongoOp({ data: {
			token: getToken(),
			collection: "topics",
			action: "findOne",
			body: { filter: {
				categoryId: cat.id,
				slug: topicSlug
			} }
		} })).document;
	},
	async createTopic(input) {
		const t = {
			id: uid("t"),
			categoryId: input.categoryId,
			title: input.title,
			slug: slugify(input.title),
			description: input.description,
			createdAt: now(),
			updatedAt: now()
		};
		await runMongoOp({ data: {
			token: getToken(),
			collection: "topics",
			action: "insertOne",
			body: { document: t }
		} });
		return t;
	},
	async updateTopic(id, patch) {
		const updatePayload = {
			updatedAt: now(),
			...patch
		};
		if (patch.title) updatePayload.slug = slugify(patch.title);
		await runMongoOp({ data: {
			token: getToken(),
			collection: "topics",
			action: "updateOne",
			body: {
				filter: { id },
				update: { $set: updatePayload }
			}
		} });
	},
	async deleteTopic(id) {
		const token = getToken();
		await runMongoOp({ data: {
			token,
			collection: "topics",
			action: "deleteOne",
			body: { filter: { id } }
		} });
		const dayIds = ((await runMongoOp({ data: {
			token,
			collection: "days",
			action: "find",
			body: { filter: { topicId: id } }
		} })).documents || []).map((d) => d.id);
		if (dayIds.length > 0) {
			await runMongoOp({ data: {
				token,
				collection: "days",
				action: "deleteMany",
				body: { filter: { topicId: id } }
			} });
			await runMongoOp({ data: {
				token,
				collection: "files",
				action: "deleteMany",
				body: { filter: { dayId: { $in: dayIds } } }
			} });
		}
	},
	async listDays(topicId) {
		return ((await runMongoOp({ data: {
			token: getToken(),
			collection: "days",
			action: "find",
			body: { filter: { topicId } }
		} })).documents || []).sort((a, b) => b.dayNumber - a.dayNumber);
	},
	async listRecentDays(limit = 3) {
		return (await runMongoOp({ data: {
			token: getToken(),
			collection: "days",
			action: "find",
			body: {
				filter: {},
				sort: { createdAt: -1 },
				limit
			}
		} })).documents || [];
	},
	async getDay(topicId, dayNumber) {
		return (await runMongoOp({ data: {
			token: getToken(),
			collection: "days",
			action: "findOne",
			body: { filter: {
				topicId,
				dayNumber
			} }
		} })).document;
	},
	async createDay(input) {
		const token = getToken();
		let nextNumber = 1;
		try {
			const res = await runMongoOp({ data: {
				token,
				collection: "days",
				action: "find",
				body: {
					filter: {},
					sort: { dayNumber: -1 },
					limit: 1
				}
			} });
			if (res && res.documents && res.documents.length > 0) nextNumber = res.documents[0].dayNumber + 1;
		} catch (err) {
			console.error("Failed to find global max day", err);
		}
		const d = {
			id: uid("d"),
			topicId: input.topicId,
			dayNumber: nextNumber,
			title: input.title,
			note: input.note,
			createdAt: now(),
			updatedAt: now()
		};
		await runMongoOp({ data: {
			token,
			collection: "days",
			action: "insertOne",
			body: { document: d }
		} });
		await runMongoOp({ data: {
			token,
			collection: "topics",
			action: "updateOne",
			body: {
				filter: { id: input.topicId },
				update: { $set: { updatedAt: now() } }
			}
		} });
		return d;
	},
	async updateDay(id, patch) {
		const updatePayload = {
			...patch,
			updatedAt: now()
		};
		await runMongoOp({ data: {
			token: getToken(),
			collection: "days",
			action: "updateOne",
			body: {
				filter: { id },
				update: { $set: updatePayload }
			}
		} });
	},
	async deleteDay(id) {
		const token = getToken();
		await runMongoOp({ data: {
			token,
			collection: "days",
			action: "deleteOne",
			body: { filter: { id } }
		} });
		await runMongoOp({ data: {
			token,
			collection: "files",
			action: "deleteMany",
			body: { filter: { dayId: id } }
		} });
	},
	async listFiles(dayId) {
		return ((await runMongoOp({ data: {
			token: getToken(),
			collection: "files",
			action: "find",
			body: { filter: { dayId } }
		} })).documents || []).sort((a, b) => a.displayOrder - b.displayOrder);
	},
	async createFile(input) {
		let order = input.displayOrder;
		if (!order) order = (await this.listFiles(input.dayId)).length + 1;
		const f = {
			...input,
			id: uid("f"),
			displayOrder: order
		};
		const token = getToken();
		await runMongoOp({ data: {
			token,
			collection: "files",
			action: "insertOne",
			body: { document: f }
		} });
		if ((await runMongoOp({ data: {
			token: getToken(),
			collection: "days",
			action: "findOne",
			body: { filter: { id: input.dayId } }
		} })).document) await runMongoOp({ data: {
			token,
			collection: "days",
			action: "updateOne",
			body: {
				filter: { id: input.dayId },
				update: { $set: { updatedAt: now() } }
			}
		} });
		return f;
	},
	async updateFile(id, patch) {
		await runMongoOp({ data: {
			token: getToken(),
			collection: "files",
			action: "updateOne",
			body: {
				filter: { id },
				update: { $set: patch }
			}
		} });
	},
	async deleteFile(id) {
		await runMongoOp({ data: {
			token: getToken(),
			collection: "files",
			action: "deleteOne",
			body: { filter: { id } }
		} });
	},
	async search(q) {
		const query = q.trim().toLowerCase();
		if (!query) return { topics: [] };
		const categories = await this.listCategories();
		const catById = new Map(categories.map((c) => [c.id, c]));
		return { topics: ((await runMongoOp({ data: {
			token: getToken(),
			collection: "topics",
			action: "find",
			body: {}
		} })).documents || []).filter((t) => t.title.toLowerCase().includes(query) || (t.description ?? "").toLowerCase().includes(query)).map((t) => ({
			...t,
			categorySlug: catById.get(t.categoryId)?.slug ?? ""
		})) };
	},
	async formatWithAI(code, language, aiNote) {
		const token = getToken();
		if (!token) {
			if (language === "javascript" || language === "css") return code.replace(/;\s*(?=\S)/g, ";\n").replace(/\{\s*/g, " {\n").replace(/\s*\}/g, "\n}").replace(/\n{3,}/g, "\n\n");
			return code;
		}
		return (await formatWithAIFn({ data: {
			token,
			code,
			language,
			aiNote
		} })).formattedCode;
	},
	getSettings() {
		return loadSettings();
	},
	setSettings(patch) {
		const next = {
			...loadSettings(),
			...patch
		};
		saveSettings(next);
		return next;
	}
};
//#endregion
export { useStore as n, api as t };
