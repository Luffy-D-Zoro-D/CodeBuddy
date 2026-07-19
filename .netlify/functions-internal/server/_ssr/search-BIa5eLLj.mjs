import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useStore } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as SiteHeader } from "./SiteHeader-CTIn57BM.mjs";
import { t as Route } from "./search-B7CBJPLm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BIa5eLLj.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	useStore();
	const { q } = Route.useSearch();
	const { topics: results } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight text-foreground",
					children: "Search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Results for ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-foreground",
						children: [
							"\"",
							q,
							"\""
						]
					})] }) : "Type a query in the header to search topics."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 divide-y divide-border rounded-xl border border-border bg-card",
					children: [results.length === 0 && q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-6 text-sm text-muted-foreground",
						children: "No topics match."
					}), results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/browse/$category",
						params: { category: r.categorySlug },
						hash: r.slug,
						className: "block px-5 py-4 transition hover:bg-secondary/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: r.title
						}), r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: r.description
						})]
					}) }, r.id))]
				})
			]
		})]
	});
}
//#endregion
export { SearchPage as component };
