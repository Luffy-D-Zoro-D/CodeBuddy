import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse._category.index-gLf6sT-4.js
var $$splitComponentImporter = () => import("./browse._category.index-BihcV44C.mjs");
var Route = createFileRoute("/browse/$category/")({
	loader: async ({ params: { category } }) => {
		const cat = await api.getCategoryBySlug(category);
		if (!cat) throw notFound();
		const topics = await api.listTopics(cat.id);
		const daysPerTopicList = await Promise.all(topics.map(async (t) => {
			const days = await api.listDays(t.id);
			return {
				topicId: t.id,
				days
			};
		}));
		return {
			cat,
			topics,
			daysByTopic: new Map(daysPerTopicList.map((d) => [d.topicId, d.days]))
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => ({ meta: [{ title: `${params.category.toUpperCase()} — CodeBuddy` }, {
		name: "description",
		content: `${params.category.toUpperCase()} topics organized day-by-day.`
	}] })
});
//#endregion
export { Route as t };
