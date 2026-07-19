import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-B7CBJPLm.js
var $$splitComponentImporter = () => import("./search-BIa5eLLj.mjs");
var searchSchema = objectType({ q: stringType().catch("") });
var Route = createFileRoute("/search")({
	validateSearch: searchSchema,
	loaderDeps: ({ search: { q } }) => ({ q }),
	loader: async ({ deps: { q } }) => {
		return await api.search(q);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Search — CodeBuddy" }, {
		name: "robots",
		content: "noindex"
	}] })
});
//#endregion
export { Route as t };
