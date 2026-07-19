import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useStore } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as ChevronRight, b as CalendarDays, v as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./SiteHeader-CTIn57BM.mjs";
import { t as Route } from "./browse._category.index-gLf6sT-4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse._category.index-BihcV44C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	useStore();
	const { cat, topics, daysByTopic } = Route.useLoaderData();
	const [openId, setOpenId] = (0, import_react.useState)(topics[0]?.id ?? null);
	(0, import_react.useEffect)(() => {
		const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
		if (hash) {
			const t = topics.find((x) => x.slug === hash);
			if (t) setOpenId(t.id);
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-foreground",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: cat.name
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-semibold tracking-tight text-foreground",
					children: cat.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted-foreground",
					children: [
						topics.length,
						" ",
						topics.length === 1 ? "topic" : "topics",
						" · newest on top"
					]
				}),
				topics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground",
					children: "No topics yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-3",
					children: topics.map((t) => {
						const days = daysByTopic.get(t.id) || [];
						const isOpen = openId === t.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							id: t.slug,
							className: "overflow-hidden rounded-xl border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpenId(isOpen ? null : t.id),
								className: "flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-secondary/50",
								children: [
									isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-base font-semibold text-foreground",
											children: t.title
										}), t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm text-muted-foreground",
											children: t.description
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
										children: [
											days.length,
											" ",
											days.length === 1 ? "day" : "days"
										]
									})
								]
							}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border bg-background/40 px-5 py-3",
								children: days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-2 text-sm text-muted-foreground",
									children: "No entries yet for this topic."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-border",
									children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/browse/$category/$topic/$day",
										params: {
											category: cat.slug,
											topic: t.slug,
											day: String(d.dayNumber)
										},
										className: "flex items-center gap-3 py-2.5 text-sm transition hover:text-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-foreground",
												children: ["Day ", d.dayNumber]
											}),
											d.title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "truncate text-muted-foreground",
												children: ["— ", d.title]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto text-xs text-muted-foreground",
												children: new Date(d.createdAt).toLocaleDateString()
											})
										]
									}) }, d.id))
								})
							})]
						}, t.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { CategoryPage as component };
