import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useStore, t as api } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./button-U1a_XzUE.mjs";
import { i as Search, l as LayoutDashboard, s as LogOut, u as FolderTree } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteHeader-CTIn57BM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const storeVer = useStore();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [authed, setAuthed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setAuthed(api.isAuthed());
	}, [storeVer]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center gap-4 px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-baseline gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: "CodeBuddy"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "relative ml-4 hidden flex-1 max-w-md md:block",
					onSubmit: (e) => {
						e.preventDefault();
						if (q.trim()) navigate({
							to: "/search",
							search: { q }
						});
					},
					suppressHydrationWarning: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search lectures…",
						className: "pl-9 h-9 bg-secondary/60 border-transparent focus-visible:border-border",
						suppressHydrationWarning: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "ml-auto flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "text-base font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/explorer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "mr-2 h-5 w-5" }), "Explorer"]
						})
					}), authed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "text-base font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 h-5 w-5" }), "Dashboard"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "text-base font-medium",
						onClick: () => {
							api.logout();
							navigate({ to: "/" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-5 w-5" }), "Sign out"]
					})] }) : null]
				})
			]
		})
	});
}
//#endregion
export { SiteHeader as t };
