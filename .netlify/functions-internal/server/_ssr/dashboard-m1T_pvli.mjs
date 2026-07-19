import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { M as notFound, g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useStore, t as api } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime, _ as DialogTrigger$1, a as Overlay2, c as Title2, d as DialogClose, f as DialogContent$1, g as DialogTitle$1, h as DialogPortal$1, i as Description2, l as Trigger2, m as DialogOverlay$1, n as Cancel, o as Portal2, p as DialogDescription$1, r as Content2, s as Root2, t as Action, u as Dialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn, n as Input, r as buttonVariants, t as Button } from "./button-U1a_XzUE.mjs";
import { a as Save, b as CalendarDays, c as LoaderCircle, g as ChevronUp, n as Trash2, o as Plus, p as FileCodeCorner, r as Sparkles, t as X, v as ChevronDown, y as Check } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./SiteHeader-CTIn57BM.mjs";
import { t as CodeViewer } from "./CodeViewer-Bit_9fbb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-Cabb-C56.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-m1T_pvli.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function Dashboard() {
	const storeVer = useStore();
	useNavigate();
	const [isChecking, setIsChecking] = (0, import_react.useState)(true);
	const [isAuthed, setIsAuthed] = (0, import_react.useState)(true);
	const isLuffy = api.getUsername() === "luffy";
	(0, import_react.useEffect)(() => {
		if (!api.isAuthed()) setIsAuthed(false);
		else setIsChecking(false);
	}, [storeVer]);
	if (!isAuthed) throw notFound();
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.listCategories()
	});
	const [selectedCat, setSelectedCat] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "";
		return localStorage.getItem("dash_cat") || "";
	});
	(0, import_react.useEffect)(() => {
		if (selectedCat) localStorage.setItem("dash_cat", selectedCat);
		if (!selectedCat && categories[0]) setSelectedCat(categories[0].id);
	}, [categories, selectedCat]);
	const { data: topics = [], refetch: refetchTopics, isLoading: isLoadingTopics } = useQuery({
		queryKey: ["topics", selectedCat],
		queryFn: () => api.listTopics(selectedCat),
		enabled: !!selectedCat
	});
	const [selectedTopicId, setSelectedTopicId] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("dash_topic");
	});
	(0, import_react.useEffect)(() => {
		if (selectedTopicId) localStorage.setItem("dash_topic", selectedTopicId);
		if (topics.length > 0 && !topics.find((t) => t.id === selectedTopicId)) setSelectedTopicId(topics[0]?.id ?? null);
	}, [topics, selectedTopicId]);
	const selectedTopic = topics.find((t) => t.id === selectedTopicId) ?? null;
	const { data: days = [], refetch: refetchDays, isLoading: isLoadingDays } = useQuery({
		queryKey: ["days", selectedTopicId],
		queryFn: () => api.listDays(selectedTopicId),
		enabled: !!selectedTopicId
	});
	const [selectedDayId, setSelectedDayId] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("dash_day");
	});
	(0, import_react.useEffect)(() => {
		if (selectedDayId) localStorage.setItem("dash_day", selectedDayId);
		if (days.length > 0 && !days.find((d) => d.id === selectedDayId)) setSelectedDayId(days[0]?.id ?? null);
	}, [days, selectedDayId]);
	const selectedDay = days.find((d) => d.id === selectedDayId) ?? null;
	const { data: files = [], refetch: refetchFiles, isLoading: isLoadingFiles } = useQuery({
		queryKey: ["files", selectedDayId],
		queryFn: () => api.listFiles(selectedDayId),
		enabled: !!selectedDayId
	});
	const [selectedFileId, setSelectedFileId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!files.find((f) => f.id === selectedFileId)) setSelectedFileId(files[0]?.id ?? null);
	}, [files, selectedFileId]);
	const currentFile = files.find((f) => f.id === selectedFileId) ?? null;
	const [draft, setDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setDraft(currentFile?.content ?? "");
	}, [currentFile?.id]);
	const saveFile = async () => {
		if (!currentFile) return;
		await api.updateFile(currentFile.id, { content: draft });
		refetchFiles();
		toast.success("Saved");
	};
	const formatAI = async () => {
		if (!currentFile) return;
		try {
			const out = await api.formatWithAI(draft, currentFile.language, currentFile.aiNote);
			setDraft(out);
			toast.success("Formatted — click Save to persist");
		} catch (e) {
			toast.error(e.message);
		}
	};
	if (isChecking) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full flex-1 max-w-[1600px] grid-cols-1 gap-6 overflow-hidden px-6 py-6 lg:grid-cols-[280px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4 overflow-y-auto pb-4 pr-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: "Subject"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedCat,
							onValueChange: setSelectedCat,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-2 w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a subject" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: c.name
							}, c.id)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Topics (newest first)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewTopicDialog, {
								categoryId: selectedCat,
								onCreated: (t) => {
									setSelectedTopicId(t.id);
									refetchTopics();
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-0.5",
							children: [
								isLoadingTopics && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "py-2 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-4 w-4 animate-spin text-muted-foreground" })
								}),
								!isLoadingTopics && topics.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "rounded-md px-2 py-2 text-xs text-muted-foreground",
									children: "No topics"
								}),
								topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedTopicId(t.id),
									className: `w-full truncate rounded-md px-2 py-1.5 text-left text-sm transition ${selectedTopicId === t.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"}`,
									children: t.title
								}) }, t.id))
							]
						})
					]
				}), selectedTopic && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewDayDialog, {
							topic: selectedTopic,
							onCreated: (d) => {
								setSelectedDayId(d.id);
								refetchDays();
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-0.5",
						children: [
							isLoadingDays && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "py-2 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-4 w-4 animate-spin text-muted-foreground" })
							}),
							!isLoadingDays && days.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md px-2 py-2 text-xs text-muted-foreground",
								children: "No days yet"
							}),
							days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedDayId(d.id),
								className: `flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-sm transition ${selectedDayId === d.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: d.title && d.title !== `Day ${d.dayNumber}` ? `Day ${d.dayNumber} : ${d.title}` : `Day ${d.dayNumber}`
								})]
							}) }, d.id))
						]
					})]
				})]
			}), !selectedTopic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex min-w-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-12 text-center text-sm text-muted-foreground",
				children: "Create your first topic (e.g. \"Positions in CSS\"), then add Day 1, Day 2, and so on."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col overflow-hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6 overflow-y-auto pb-6 pr-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Topic"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 break-words text-2xl font-semibold tracking-tight text-foreground",
									children: selectedTopic.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditTopicDialog, {
									topic: selectedTopic,
									onUpdated: refetchTopics
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteTopic, {
									topic: selectedTopic,
									onDeleted: () => {
										setSelectedTopicId(null);
										refetchTopics();
									}
								})]
							})]
						}), selectedTopic.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: selectedTopic.description
						})] }), !selectedDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground",
							children: "Add a day entry from the sidebar to attach today's code and notes."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: ["Day ", selectedDay.dayNumber]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-1 break-words text-lg font-semibold text-foreground",
											children: selectedDay.title && selectedDay.title !== `Day ${selectedDay.dayNumber}` ? `Day ${selectedDay.dayNumber} : ${selectedDay.title}` : `Day ${selectedDay.dayNumber}`
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditDayDialog, {
											day: selectedDay,
											onUpdated: refetchDays
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDay, {
											day: selectedDay,
											onDeleted: () => {
												setSelectedDayId(null);
												refetchDays();
											}
										})]
									})]
								}),
								selectedDay.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 rounded-lg bg-secondary/50 p-3 text-sm text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap",
										children: selectedDay.note
									})
								}),
								currentFile && isLuffy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 space-y-1.5 border-t border-border pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs uppercase tracking-wider text-muted-foreground",
										children: "AI note (context for Format-with-AI)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: currentFile.aiNote ?? "",
										onChange: async (e) => {
											await api.updateFile(currentFile.id, { aiNote: e.target.value });
											refetchFiles();
										},
										rows: 3,
										placeholder: "e.g. Demonstrates flexbox row alignment with 3 items",
										className: "resize-none"
									})]
								})
							]
						})]
					})
				}), selectedDay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/20 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1",
							children: [isLoadingFiles ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" })
							}) : files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedFileId(f.id),
								className: `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition ${selectedFileId === f.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCodeCorner, { className: "h-3.5 w-3.5" }), f.displayName]
							}, f.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewFileDialog, {
								dayId: selectedDay.id,
								onCreated: (f) => {
									setSelectedFileId(f.id);
									refetchFiles();
								}
							})]
						}), currentFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								isLuffy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: formatAI,
									className: "h-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), " Format with AI"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: saveFile,
									className: "h-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-3.5 w-3.5" }), " Save"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteFile, {
									file: currentFile,
									onDeleted: () => {
										setSelectedFileId(null);
										refetchFiles();
									}
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex-1 overflow-hidden p-0",
						children: currentFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeViewer, {
							value: draft,
							language: currentFile.language,
							readOnly: false,
							onChange: setDraft,
							height: "100%"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col items-center justify-center text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCodeCorner, { className: "mb-2 h-8 w-8 opacity-20" }), "No files yet. Add one to start."]
						})
					})]
				})]
			})]
		})]
	});
}
function NewTopicDialog({ categoryId, onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "h-7 w-7",
				disabled: !categoryId,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New topic" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "e.g. Positions in CSS"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: !title.trim(),
				onClick: async () => {
					onCreated(await api.createTopic({
						categoryId,
						title: title.trim(),
						description: description.trim() || void 0
					}));
					setOpen(false);
					setTitle("");
					setDescription("");
					toast.success("Topic created");
				},
				children: "Create"
			})] })
		] })]
	});
}
function EditTopicDialog({ topic, onUpdated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)(topic.title);
	const [description, setDescription] = (0, import_react.useState)(topic.description ?? "");
	(0, import_react.useEffect)(() => {
		setTitle(topic.title);
		setDescription(topic.description ?? "");
	}, [topic.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				children: "Edit"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit topic" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					await api.updateTopic(topic.id, {
						title,
						description
					});
					onUpdated();
					setOpen(false);
					toast.success("Topic updated");
				},
				children: "Save"
			})] })
		] })]
	});
}
function DeleteTopic({ topic, onDeleted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			className: "text-destructive hover:text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Delete"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
		"Delete \"",
		topic.title,
		"\"?"
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Removes the topic, all its days, and files. Cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: async () => {
			await api.deleteTopic(topic.id);
			onDeleted();
			toast.success("Topic deleted");
		},
		children: "Delete"
	})] })] })] });
}
function getFormattedDate() {
	const date = /* @__PURE__ */ new Date();
	const day = date.getDate();
	return `${day}${day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th"}-${date.toLocaleString("default", { month: "short" })}-${date.getFullYear().toString().slice(-2)}`;
}
function NewDayDialog({ topic, onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setTitle(getFormattedDate());
			setNote("");
		}
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "h-7 w-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New day entry" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Day title (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "e.g. Absolute & fixed"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: note,
						onChange: (e) => setNote(e.target.value),
						rows: 4,
						placeholder: "What you covered today…"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					const d = await api.createDay({
						topicId: topic.id,
						title: title.trim() || void 0,
						note: note.trim() || void 0
					});
					onCreated(d);
					setOpen(false);
					setTitle("");
					setNote("");
					toast.success(`Day ${d.dayNumber} added`);
				},
				children: "Add day"
			})] })
		] })]
	});
}
function EditDayDialog({ day, onUpdated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)(day.title ?? "");
	const [note, setNote] = (0, import_react.useState)(day.note ?? "");
	(0, import_react.useEffect)(() => {
		setTitle(day.title ?? "");
		setNote(day.note ?? "");
	}, [day.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				children: "Edit"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Edit day ", day.dayNumber] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: note,
						onChange: (e) => setNote(e.target.value),
						rows: 5
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					await api.updateDay(day.id, {
						title: title || void 0,
						note: note || void 0
					});
					onUpdated();
					setOpen(false);
					toast.success("Day updated");
				},
				children: "Save"
			})] })
		] })]
	});
}
function DeleteDay({ day, onDeleted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			className: "text-destructive hover:text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Delete day"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
		"Delete day ",
		day.dayNumber,
		"?"
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "All files in this day will be removed." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: async () => {
			await api.deleteDay(day.id);
			onDeleted();
			toast.success("Day deleted");
		},
		children: "Delete"
	})] })] })] });
}
function NewFileDialog({ dayId, onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [displayName, setDisplayName] = (0, import_react.useState)("index.html");
	const [language, setLanguage] = (0, import_react.useState)("html");
	const [content, setContent] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "ghost",
				className: "h-7 gap-1 px-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add file"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add file" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "File name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value),
							className: "font-mono"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: language,
							onValueChange: (v) => setLanguage(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "html",
									children: "HTML"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "css",
									children: "CSS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "javascript",
									children: "JavaScript"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "text",
									children: "Text"
								})
							] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: content,
						onChange: (e) => setContent(e.target.value),
						rows: 10,
						className: "font-mono text-xs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !displayName.trim(),
					onClick: async () => {
						onCreated(await api.createFile({
							dayId,
							displayName,
							filename: displayName,
							language,
							content
						}));
						setOpen(false);
						setContent("");
						toast.success("File added");
					},
					children: "Add"
				})] })
			]
		})]
	});
}
function DeleteFile({ file, onDeleted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: "h-8 w-8 text-destructive hover:text-destructive",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
		"Delete ",
		file.displayName,
		"?"
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: async () => {
			await api.deleteFile(file.id);
			onDeleted();
			toast.success("File deleted");
		},
		children: "Delete"
	})] })] })] });
}
//#endregion
export { Dashboard as component };
