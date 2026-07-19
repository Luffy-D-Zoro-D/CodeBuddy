import { y as __toESM } from "./createServerFn-CIHAFgYl.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as api } from "./store-BioVMgnH.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./button-U1a_XzUE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-Cabb-C56.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/oden.login-CyfV8S-D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.login(username, password);
			toast.success("Signed in");
			navigate({ to: "/dashboard" });
		} catch {
			toast.error("Invalid credentials");
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-secondary/40 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: "CodeBuddy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-2xl font-semibold tracking-tight text-foreground",
					children: "Teacher login"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Sign in to manage lectures and files."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					suppressHydrationWarning: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "u",
								children: "Username"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "u",
								value: username,
								onChange: (e) => setUsername(e.target.value),
								autoFocus: true,
								suppressHydrationWarning: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "p",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								suppressHydrationWarning: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading,
							suppressHydrationWarning: true,
							children: loading ? "Signing in…" : "Sign in"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
