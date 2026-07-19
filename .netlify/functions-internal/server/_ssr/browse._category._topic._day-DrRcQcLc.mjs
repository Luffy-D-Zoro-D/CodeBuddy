import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse._category._topic._day-DrRcQcLc.js
var $$splitComponentImporter = () => import("./browse._category._topic._day-zegcYf0I.mjs");
var Route = createFileRoute("/browse/$category/$topic/$day")({
	loader: async ({ params: { category, topic: topicSlug, day: dayStr } }) => {
		const cat = await api.getCategoryBySlug(category);
		const topic = await api.getTopic(category, topicSlug);
		const dayNumber = Number(dayStr);
		const day = topic ? await api.getDay(topic.id, dayNumber) : void 0;
		const files = day ? await api.listFiles(day.id) : [];
		if (!cat || !topic || !day) throw notFound();
		return {
			cat,
			topic,
			day,
			files
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => ({ meta: [{ title: `${params.topic} · Day ${params.day} — CodeBuddy` }, {
		name: "description",
		content: `Day ${params.day} of ${params.topic}.`
	}] })
});
//#endregion
export { Route as t };
