//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DTkCA_w1.js
var manifest = {
	"1c70a3bf92c4471161c55b3cebc48bb1987d7a4486b77b1c7cd2d8341a452223": {
		functionName: "loginFn_createServerFn_handler",
		importer: () => import("./_ssr/mongo.functions-B8xsQegc.mjs")
	},
	"98f6bb01025ff4d7d825c0ef467514953a53c98914af96457ec94faff4c56ba2": {
		functionName: "formatWithAIFn_createServerFn_handler",
		importer: () => import("./_ssr/mongo.functions-B8xsQegc.mjs")
	},
	"a427d4ce07bc4ec7dfcaf6759e20b212debe2a5d35b0701b86c82d389cf93d4d": {
		functionName: "runMongoOp_createServerFn_handler",
		importer: () => import("./_ssr/mongo.functions-B8xsQegc.mjs")
	},
	"c2c155a164c1ef85b4c7104242ed1f73b833d617889398c34f42a7b833b68ef9": {
		functionName: "changePasswordFn_createServerFn_handler",
		importer: () => import("./_ssr/mongo.functions-B8xsQegc.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
