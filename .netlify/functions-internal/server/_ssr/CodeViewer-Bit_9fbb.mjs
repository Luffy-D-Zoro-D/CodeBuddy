import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Ft } from "../_libs/monaco-editor__react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CodeViewer-Bit_9fbb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodeViewer({ value, language, readOnly = true, onChange, height = 520 }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center rounded-md border border-border bg-secondary/40 text-sm text-muted-foreground",
		style: { height },
		children: "Loading editor…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-md border border-border",
		style: typeof height === "string" ? { height } : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ft, {
			height,
			language,
			value,
			theme: "vs",
			onChange: (v) => onChange?.(v ?? ""),
			options: {
				readOnly,
				minimap: { enabled: false },
				fontSize: 14,
				lineHeight: 22,
				fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Menlo, Consolas, monospace",
				scrollBeyondLastLine: false,
				smoothScrolling: true,
				renderLineHighlight: readOnly ? "none" : "line",
				padding: {
					top: 16,
					bottom: 16
				},
				contextmenu: !readOnly,
				wordWrap: "on"
			}
		})
	});
}
//#endregion
export { CodeViewer as t };
