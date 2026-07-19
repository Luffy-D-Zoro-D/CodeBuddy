import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ct2C9My7.js
var $$splitComponentImporter = () => import("./routes-BCp9BH__.mjs");
var Route = createFileRoute("/")({
	loader: async () => {
		const categories = await api.listCategories();
		const topics = await api.listTopics();
		const recentDays = await api.listRecentDays(3);
		const daysPerTopicList = await Promise.all(topics.map(async (t) => {
			const days = await api.listDays(t.id);
			const sortedDays = days.sort((a, b) => a.dayNumber - b.dayNumber);
			return {
				topicId: t.id,
				count: days.length,
				firstDay: sortedDays[0]?.dayNumber
			};
		}));
		return {
			categories,
			topics,
			daysPerTopic: new Map(daysPerTopicList.map((d) => [d.topicId, d.count])),
			firstDayPerTopic: new Map(daysPerTopicList.map((d) => [d.topicId, d.firstDay])),
			totalDays: daysPerTopicList.reduce((sum, d) => sum + d.count, 0),
			topicsPerCategory: new Map(categories.map((c) => [c.id, topics.filter((t) => t.categoryId === c.id).length])),
			recentDays
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "CodeBuddy — Classroom code, beautifully organized" },
		{
			name: "description",
			content: "Browse day-by-day lecture notes and code for HTML, CSS, and JavaScript, organized by topic."
		},
		{
			property: "og:title",
			content: "CodeBuddy"
		},
		{
			property: "og:description",
			content: "Classroom code, organized by topic and day."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
//#endregion
export { Route as t };
