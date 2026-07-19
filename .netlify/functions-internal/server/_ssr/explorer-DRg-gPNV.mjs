import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explorer-DRg-gPNV.js
var $$splitComponentImporter = () => import("./explorer-VNmCY7-3.mjs");
var Route = createFileRoute("/explorer")({
	loader: async () => {
		return { categories: await api.listCategories() };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Explorer — CodeBuddy" }, {
		name: "description",
		content: "Tree explorer of all subjects, topics, days and files."
	}] })
});
//#endregion
export { Route as t };
