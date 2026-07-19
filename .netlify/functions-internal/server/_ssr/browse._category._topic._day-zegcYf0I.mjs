import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useStore, t as api } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./browse._category._topic._day-DrRcQcLc.mjs";
import { i as cn, t as Button } from "./button-U1a_XzUE.mjs";
import { _ as ChevronRight, h as Copy, m as Download, y as Check } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./SiteHeader-CTIn57BM.mjs";
import { t as CodeViewer } from "./CodeViewer-Bit_9fbb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse._category._topic._day-zegcYf0I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function DayPage() {
	useStore();
	const { cat, topic, day, files } = Route.useLoaderData();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [activeFile, setActiveFile] = (0, import_react.useState)(void 0);
	const isLuffy = api.getUsername() === "luffy";
	(0, import_react.useEffect)(() => {
		if (files[0]) setActiveFile((prev) => prev ?? files[0].id);
	}, [day?.id]);
	const current = files.find((f) => f.id === activeFile) ?? files[0];
	const copy = async () => {
		if (!current) return;
		await navigator.clipboard.writeText(current.content);
		setCopied(true);
		toast.success(`${current.displayName} copied`);
		setTimeout(() => setCopied(false), 1600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-foreground",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/browse/$category",
							params: { category: cat.slug },
							className: "hover:text-foreground",
							children: cat.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/browse/$category",
							params: { category: cat.slug },
							hash: topic.slug,
							className: "hover:text-foreground",
							children: topic.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-foreground",
							children: ["Day ", day.dayNumber]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex flex-wrap items-start justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: topic.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl font-semibold tracking-tight text-foreground",
							children: day.title && day.title !== `Day ${day.dayNumber}` ? `Day ${day.dayNumber} : ${day.title}` : `Day ${day.dayNumber}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							suppressHydrationWarning: true,
							children: new Date(day.createdAt).toLocaleString()
						})
					] })
				}),
				day.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 rounded-xl border border-border bg-secondary/40 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Teacher's note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm text-foreground",
						children: day.note
					})]
				}),
				files.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground",
					children: "No files for this day."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: current?.id,
					onValueChange: setActiveFile,
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
							className: "bg-secondary/60",
							children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: f.id,
								className: "font-mono text-xs",
								children: f.displayName
							}, f.id))
						}), current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: copy,
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 h-4 w-4" }), " Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-4 w-4" }),
								" Copy ",
								current.language.toUpperCase()
							] })
						})]
					}), files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: f.id,
						className: "mt-4",
						children: [
							f.aiNote && isLuffy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "AI note:"
									}),
									" ",
									f.aiNote
								]
							}),
							f.content.includes(".zip") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4",
								children: (() => {
									const match = f.content.match(/\[(.*?)\]\((.*?\.zip)\)/);
									if (match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: match[2],
											download: true,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), match[1]]
										})
									});
									return null;
								})()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeViewer, {
								value: f.content,
								language: f.language
							})
						]
					}, f.id))]
				})
			]
		})]
	});
}
//#endregion
export { DayPage as component };
