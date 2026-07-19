import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useStore, t as api } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as ChevronRight, c as LoaderCircle, d as FolderOpen, f as FolderClosed, p as FileCodeCorner, v as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./SiteHeader-CTIn57BM.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./explorer-DRg-gPNV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explorer-VNmCY7-3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExplorerPage() {
	useStore();
	const { categories } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-6 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight text-foreground",
					children: "Explorer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Browse all subjects side-by-side. Expand topics to see days and files."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryColumn, {
					categoryId: c.id,
					categorySlug: c.slug,
					name: c.name
				}, c.id))
			})]
		})]
	});
}
function CategoryColumn({ categoryId, categorySlug, name }) {
	const { data: topics = [], isLoading } = useQuery({
		queryKey: ["topics", categoryId],
		queryFn: () => api.listTopics(categoryId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-foreground",
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					topics.length,
					" ",
					topics.length === 1 ? "topic" : "topics"
				]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-4 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-4 w-4 animate-spin text-muted-foreground" })
		}) : topics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground",
			children: "No topics yet"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1",
			children: topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicNode, {
				topicId: t.id,
				title: t.title,
				topicSlug: t.slug,
				categorySlug
			}, t.id))
		})]
	});
}
function TopicNode({ topicId, title, topicSlug, categorySlug }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: days = [], isLoading } = useQuery({
		queryKey: ["days", topicId],
		queryFn: () => api.listDays(topicId),
		enabled: open
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setOpen((o) => !o),
		className: "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-secondary",
		children: [
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderClosed, { className: "h-4 w-4 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: title
			})
		]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-1 space-y-0.5 border-l border-border pl-3 ml-2",
		children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-2 py-1 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-muted-foreground" })
			}),
			!isLoading && days.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-2 py-1 text-xs text-muted-foreground",
				children: "No days yet"
			}),
			days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayNode, {
				dayId: d.id,
				dayNumber: d.dayNumber,
				dayTitle: d.title,
				categorySlug,
				topicSlug
			}, d.id))
		]
	})] });
}
function DayNode({ dayId, dayNumber, dayTitle, categorySlug, topicSlug }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: files = [], isLoading } = useQuery({
		queryKey: ["files", dayId],
		queryFn: () => api.listFiles(dayId),
		enabled: open
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "flex flex-1 items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm hover:bg-secondary",
			children: [
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderClosed, { className: "h-3.5 w-3.5 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: dayTitle && dayTitle !== `Day ${dayNumber}` ? `Day ${dayNumber} : ${dayTitle}` : `Day ${dayNumber}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/browse/$category/$topic/$day",
			params: {
				category: categorySlug,
				topic: topicSlug,
				day: String(dayNumber)
			},
			className: "rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground",
			children: "open"
		})]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-0.5 space-y-0.5 border-l border-border pl-3 ml-1.5",
		children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-2 py-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-muted-foreground" })
			}),
			!isLoading && files.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-2 py-1 text-xs text-muted-foreground",
				children: "No files"
			}),
			files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/browse/$category/$topic/$day",
				params: {
					category: categorySlug,
					topic: topicSlug,
					day: String(dayNumber)
				},
				hash: f.id,
				className: "flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCodeCorner, { className: "h-3 w-3" }), f.displayName]
			}) }, f.id))
		]
	})] });
}
//#endregion
export { ExplorerPage as component };
