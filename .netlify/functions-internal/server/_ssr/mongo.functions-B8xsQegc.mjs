import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as require_lib } from "../_libs/mongodb.mjs";
import { n as SignJWT, r as jwtVerify, t as decodeJwt } from "../_libs/jose.mjs";
import crypto from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/mongo.functions-B8xsQegc.js
var import_lib = require_lib();
var cachedClient = null;
async function getMongoClient() {
	if (cachedClient) return cachedClient;
	const uri = process.env.MONGO_URI;
	if (!uri) throw new Error("Missing MONGO_URI in .env");
	const client = new import_lib.MongoClient(uri);
	await client.connect();
	cachedClient = client;
	return client;
}
async function mongoRequest(collectionName, action, body = {}) {
	const collection = (await getMongoClient()).db("codebuddy").collection(collectionName);
	switch (action) {
		case "find": {
			let cursor = collection.find(body.filter || {});
			if (body.sort) cursor = cursor.sort(body.sort);
			if (body.limit) cursor = cursor.limit(body.limit);
			const documents = await cursor.toArray();
			return { documents: JSON.parse(JSON.stringify(documents)) };
		}
		case "findOne": {
			const document = await collection.findOne(body.filter || {});
			return { document: document ? JSON.parse(JSON.stringify(document)) : null };
		}
		case "insertOne": return { insertedId: (await collection.insertOne(body.document)).insertedId.toString() };
		case "updateOne": {
			const result = await collection.updateOne(body.filter || {}, body.update || {});
			return {
				matchedCount: result.matchedCount,
				modifiedCount: result.modifiedCount
			};
		}
		case "deleteOne": return { deletedCount: (await collection.deleteOne(body.filter || {})).deletedCount };
		case "deleteMany": return { deletedCount: (await collection.deleteMany(body.filter || {})).deletedCount };
		default: throw new Error(`Unsupported action: ${action}`);
	}
}
if (typeof window === "undefined") getMongoClient().then(() => console.log("✅ Successfully connected to MongoDB Atlas (codebuddy)")).catch((err) => console.error("❌ Failed to connect to MongoDB:", err.message));
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw && true) throw new Error("FATAL: JWT_SECRET environment variable is missing in production!");
var SECRET = new TextEncoder().encode(jwtSecretRaw || "fallback_super_secret_dev_key");
function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString("hex");
	return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function verifyPasswordHash(password, hash) {
	if (!hash.includes(":")) return false;
	const [salt, key] = hash.split(":");
	return key === crypto.scryptSync(password, salt, 64).toString("hex");
}
async function createSessionToken(username) {
	return await new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(SECRET);
}
async function verifyToken(token) {
	if (!token) return false;
	try {
		await jwtVerify(token, SECRET);
		return true;
	} catch {
		return false;
	}
}
async function verifyIsLuffy(token) {
	if (!token) return false;
	try {
		return decodeJwt(token).username === "luffy";
	} catch {
		return false;
	}
}
async function verifyCredentials(username, password) {
	try {
		if (!(await mongoRequest("users", "findOne", { filter: { username: "luffy" } })).document) await mongoRequest("users", "insertOne", { document: {
			username: "luffy",
			password: hashPassword("luffy")
		} });
	} catch (err) {
		console.error("MongoDB Error checking/creating luffy:", err);
	}
	let res;
	try {
		res = await mongoRequest("users", "findOne", { filter: { username } });
	} catch (err) {
		console.error("MongoDB Error in verifyCredentials (findOne):", err);
		return false;
	}
	if (!res.document) return false;
	return verifyPasswordHash(password, res.document.password);
}
async function changePassword(token, newPassword) {
	if (!await verifyToken(token) || !token) return false;
	const username = decodeJwt(token).username;
	await mongoRequest("users", "updateOne", {
		filter: { username },
		update: { $set: { password: hashPassword(newPassword) } }
	});
	return true;
}
async function formatCodeWithGroq(code, language, aiNote) {
	const apiKey = process.env.GROQ_API_KEY?.trim();
	if (!apiKey) throw new Error("Missing GROQ_API_KEY in .env");
	const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "llama-3.3-70b-versatile",
			temperature: 0,
			messages: [{
				role: "system",
				content: "You are a code formatter. Reformat the user's code with clean, consistent 2-space indentation and idiomatic style. Do NOT change behavior, DO NOT CHANGE THE ORIGINAL CODE PRESERVE IT. Reply with ONLY the formatted code, no markdown fences. If the user provides an 'AI note' describing intent, use it only to understand context — do not embed the note in the output."
			}, {
				role: "user",
				content: `Language: ${language}${aiNote ? `\nAI note (context): ${aiNote}` : ""}\n\n${code}`
			}]
		})
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Groq API Error: ${res.status} ${text}`);
	}
	let out = (await res.json()).choices?.[0]?.message?.content ?? code;
	out = out.replace(/^```[a-zA-Z]*\n?/, "").replace(/```\s*$/, "").trim();
	return out;
}
var runMongoOp_createServerFn_handler = createServerRpc({
	id: "a427d4ce07bc4ec7dfcaf6759e20b212debe2a5d35b0701b86c82d389cf93d4d",
	name: "runMongoOp",
	filename: "src/lib/mongo.functions.ts"
}, (opts) => runMongoOp.__executeServer(opts));
var runMongoOp = createServerFn({ method: "POST" }).validator((d) => d).handler(runMongoOp_createServerFn_handler, async ({ data: { token, collection, action, body } }) => {
	if (collection === "users") throw new Error("Direct access to the users collection is strictly prohibited");
	if (action !== "find" && action !== "findOne") {
		if (!await verifyToken(token)) throw new Error("Unauthorized: You must be logged in to modify data");
	}
	return await mongoRequest(collection, action, body);
});
var loginFn_createServerFn_handler = createServerRpc({
	id: "1c70a3bf92c4471161c55b3cebc48bb1987d7a4486b77b1c7cd2d8341a452223",
	name: "loginFn",
	filename: "src/lib/mongo.functions.ts"
}, (opts) => loginFn.__executeServer(opts));
var loginFn = createServerFn({ method: "POST" }).validator((d) => d).handler(loginFn_createServerFn_handler, async ({ data: { username, password } }) => {
	if (!await verifyCredentials(username, password)) throw new Error("Invalid credentials");
	return { token: await createSessionToken(username) };
});
var changePasswordFn_createServerFn_handler = createServerRpc({
	id: "c2c155a164c1ef85b4c7104242ed1f73b833d617889398c34f42a7b833b68ef9",
	name: "changePasswordFn",
	filename: "src/lib/mongo.functions.ts"
}, (opts) => changePasswordFn.__executeServer(opts));
var changePasswordFn = createServerFn({ method: "POST" }).validator((d) => d).handler(changePasswordFn_createServerFn_handler, async ({ data: { token, newPassword } }) => {
	const success = await changePassword(token, newPassword);
	if (!success) throw new Error("Unauthorized or failed to change password");
	return { success };
});
var formatWithAIFn_createServerFn_handler = createServerRpc({
	id: "98f6bb01025ff4d7d825c0ef467514953a53c98914af96457ec94faff4c56ba2",
	name: "formatWithAIFn",
	filename: "src/lib/mongo.functions.ts"
}, (opts) => formatWithAIFn.__executeServer(opts));
var formatWithAIFn = createServerFn({ method: "POST" }).validator((d) => d).handler(formatWithAIFn_createServerFn_handler, async ({ data: { token, code, language, aiNote } }) => {
	const isAuthed = await verifyToken(token);
	const isLuffy = await verifyIsLuffy(token);
	if (!isAuthed || !isLuffy) throw new Error("Unauthorized: Only luffy can use AI features");
	return { formattedCode: await formatCodeWithGroq(code, language, aiNote) };
});
//#endregion
export { changePasswordFn_createServerFn_handler, formatWithAIFn_createServerFn_handler, loginFn_createServerFn_handler, runMongoOp_createServerFn_handler };
