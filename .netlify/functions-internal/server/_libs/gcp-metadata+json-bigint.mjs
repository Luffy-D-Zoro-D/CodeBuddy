import { _ as __require, m as __commonJSMin } from "../_ssr/createServerFn-CIHAFgYl.mjs";
import { t as require_src$1 } from "./gaxios.mjs";
import { t as require_bignumber } from "./bignumber.js.mjs";
//#region ../../../node_modules/json-bigint/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = require_bignumber();
	var JSON = module.exports;
	(function() {
		"use strict";
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
			"\b": "\\b",
			"	": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			"\"": "\\\"",
			"\\": "\\\\"
		}, rep;
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? "\"" + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + "\"" : "\"" + string + "\"";
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
			if (value && typeof value === "object" && typeof value.toJSON === "function") value = value.toJSON(key);
			if (typeof rep === "function") value = rep.call(holder, key, value);
			switch (typeof value) {
				case "string": if (isBigNumber) return value;
				else return quote(value);
				case "number": return isFinite(value) ? String(value) : "null";
				case "boolean":
				case "null":
				case "bigint": return String(value);
				case "object":
					if (!value) return "null";
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === "[object Array]") {
						length = value.length;
						for (i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v;
					}
					if (rep && typeof rep === "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
							k = rep[i];
							v = str(k, value);
							if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
						}
					} else Object.keys(value).forEach(function(k) {
						var v = str(k, value);
						if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
					});
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v;
			}
		}
		if (typeof JSON.stringify !== "function") JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") for (i = 0; i < space; i += 1) indent += " ";
			else if (typeof space === "string") indent = space;
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) throw new Error("JSON.stringify");
			return str("", { "": value });
		};
	})();
}));
//#endregion
//#region ../../../node_modules/json-bigint/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = null;
	var suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
	var suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
	var json_parse = function(options) {
		"use strict";
		var _options = {
			strict: false,
			storeAsString: false,
			alwaysParseAsBig: false,
			useNativeBigInt: false,
			protoAction: "error",
			constructorAction: "error"
		};
		if (options !== void 0 && options !== null) {
			if (options.strict === true) _options.strict = true;
			if (options.storeAsString === true) _options.storeAsString = true;
			_options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
			_options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
			if (typeof options.constructorAction !== "undefined") if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") _options.constructorAction = options.constructorAction;
			else throw new Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`);
			if (typeof options.protoAction !== "undefined") if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") _options.protoAction = options.protoAction;
			else throw new Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`);
		}
		var at, ch, escapee = {
			"\"": "\"",
			"\\": "\\",
			"/": "/",
			b: "\b",
			f: "\f",
			n: "\n",
			r: "\r",
			t: "	"
		}, text, error = function(m) {
			throw {
				name: "SyntaxError",
				message: m,
				at,
				text
			};
		}, next = function(c) {
			if (c && c !== ch) error("Expected '" + c + "' instead of '" + ch + "'");
			ch = text.charAt(at);
			at += 1;
			return ch;
		}, number = function() {
			var number, string = "";
			if (ch === "-") {
				string = "-";
				next("-");
			}
			while (ch >= "0" && ch <= "9") {
				string += ch;
				next();
			}
			if (ch === ".") {
				string += ".";
				while (next() && ch >= "0" && ch <= "9") string += ch;
			}
			if (ch === "e" || ch === "E") {
				string += ch;
				next();
				if (ch === "-" || ch === "+") {
					string += ch;
					next();
				}
				while (ch >= "0" && ch <= "9") {
					string += ch;
					next();
				}
			}
			number = +string;
			if (!isFinite(number)) error("Bad number");
			else {
				if (BigNumber == null) BigNumber = require_bignumber();
				if (string.length > 15) return _options.storeAsString ? string : _options.useNativeBigInt ? BigInt(string) : new BigNumber(string);
				else return !_options.alwaysParseAsBig ? number : _options.useNativeBigInt ? BigInt(number) : new BigNumber(number);
			}
		}, string = function() {
			var hex, i, string = "", uffff;
			if (ch === "\"") {
				var startAt = at;
				while (next()) {
					if (ch === "\"") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						return string;
					}
					if (ch === "\\") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						if (ch === "u") {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) break;
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (typeof escapee[ch] === "string") string += escapee[ch];
						else break;
						startAt = at;
					}
				}
			}
			error("Bad string");
		}, white = function() {
			while (ch && ch <= " ") next();
		}, word = function() {
			switch (ch) {
				case "t":
					next("t");
					next("r");
					next("u");
					next("e");
					return true;
				case "f":
					next("f");
					next("a");
					next("l");
					next("s");
					next("e");
					return false;
				case "n":
					next("n");
					next("u");
					next("l");
					next("l");
					return null;
			}
			error("Unexpected '" + ch + "'");
		}, value, array = function() {
			var array = [];
			if (ch === "[") {
				next("[");
				white();
				if (ch === "]") {
					next("]");
					return array;
				}
				while (ch) {
					array.push(value());
					white();
					if (ch === "]") {
						next("]");
						return array;
					}
					next(",");
					white();
				}
			}
			error("Bad array");
		}, object = function() {
			var key, object = Object.create(null);
			if (ch === "{") {
				next("{");
				white();
				if (ch === "}") {
					next("}");
					return object;
				}
				while (ch) {
					key = string();
					white();
					next(":");
					if (_options.strict === true && Object.hasOwnProperty.call(object, key)) error("Duplicate key \"" + key + "\"");
					if (suspectProtoRx.test(key) === true) if (_options.protoAction === "error") error("Object contains forbidden prototype property");
					else if (_options.protoAction === "ignore") value();
					else object[key] = value();
					else if (suspectConstructorRx.test(key) === true) if (_options.constructorAction === "error") error("Object contains forbidden constructor property");
					else if (_options.constructorAction === "ignore") value();
					else object[key] = value();
					else object[key] = value();
					white();
					if (ch === "}") {
						next("}");
						return object;
					}
					next(",");
					white();
				}
			}
			error("Bad object");
		};
		value = function() {
			white();
			switch (ch) {
				case "{": return object();
				case "[": return array();
				case "\"": return string();
				case "-": return number();
				default: return ch >= "0" && ch <= "9" ? number() : word();
			}
		};
		return function(source, reviver) {
			var result;
			text = source + "";
			at = 0;
			ch = " ";
			result = value();
			white();
			if (ch) error("Syntax error");
			return typeof reviver === "function" ? (function walk(holder, key) {
				var v, value = holder[key];
				if (value && typeof value === "object") Object.keys(value).forEach(function(k) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				});
				return reviver.call(holder, key, value);
			})({ "": result }, "") : result;
		};
	};
	module.exports = json_parse;
}));
//#endregion
//#region ../../../node_modules/json-bigint/index.js
var require_json_bigint = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var json_stringify = require_stringify().stringify;
	var json_parse = require_parse();
	module.exports = function(options) {
		return {
			parse: json_parse(options),
			stringify: json_stringify
		};
	};
	module.exports.parse = json_parse();
	module.exports.stringify = json_stringify;
}));
//#endregion
//#region ../../../node_modules/gcp-metadata/build/src/gcp-residency.js
var require_gcp_residency = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2022 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.detectGCPResidency = exports.isGoogleComputeEngine = exports.isGoogleComputeEngineMACAddress = exports.isGoogleComputeEngineLinux = exports.isGoogleCloudServerless = exports.GCE_LINUX_BIOS_PATHS = void 0;
	var fs_1 = __require("fs");
	var os_1 = __require("os");
	/**
	* Known paths unique to Google Compute Engine Linux instances
	*/
	exports.GCE_LINUX_BIOS_PATHS = {
		BIOS_DATE: "/sys/class/dmi/id/bios_date",
		BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
	};
	var GCE_MAC_ADDRESS_REGEX = /^42:01/;
	/**
	* Determines if the process is running on a Google Cloud Serverless environment (Cloud Run or Cloud Functions instance).
	*
	* Uses the:
	* - {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables}.
	* - {@link https://cloud.google.com/functions/docs/env-var Cloud Functions environment variables}.
	*
	* @returns {boolean} `true` if the process is running on GCP serverless, `false` otherwise.
	*/
	function isGoogleCloudServerless() {
		return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE);
	}
	exports.isGoogleCloudServerless = isGoogleCloudServerless;
	/**
	* Determines if the process is running on a Linux Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on Linux GCE, `false` otherwise.
	*/
	function isGoogleComputeEngineLinux() {
		if ((0, os_1.platform)() !== "linux") return false;
		try {
			(0, fs_1.statSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
			const biosVendor = (0, fs_1.readFileSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
			return /Google/.test(biosVendor);
		} catch (_a) {
			return false;
		}
	}
	exports.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
	/**
	* Determines if the process is running on a Google Compute Engine instance with a known
	* MAC address.
	*
	* @returns {boolean} `true` if the process is running on GCE (as determined by MAC address), `false` otherwise.
	*/
	function isGoogleComputeEngineMACAddress() {
		const interfaces = (0, os_1.networkInterfaces)();
		for (const item of Object.values(interfaces)) {
			if (!item) continue;
			for (const { mac } of item) if (GCE_MAC_ADDRESS_REGEX.test(mac)) return true;
		}
		return false;
	}
	exports.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
	/**
	* Determines if the process is running on a Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on GCE, `false` otherwise.
	*/
	function isGoogleComputeEngine() {
		return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
	}
	exports.isGoogleComputeEngine = isGoogleComputeEngine;
	/**
	* Determines if the process is running on Google Cloud Platform.
	*
	* @returns {boolean} `true` if the process is running on GCP, `false` otherwise.
	*/
	function detectGCPResidency() {
		return isGoogleCloudServerless() || isGoogleComputeEngine();
	}
	exports.detectGCPResidency = detectGCPResidency;
}));
//#endregion
//#region ../../../node_modules/gcp-metadata/build/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2018 Google LLC
	*
	* Distributed under MIT license.
	* See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
	*/
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.requestTimeout = exports.setGCPResidency = exports.getGCPResidency = exports.gcpResidencyCache = exports.resetIsAvailableCache = exports.isAvailable = exports.project = exports.instance = exports.METADATA_SERVER_DETECTION = exports.HEADERS = exports.HEADER_VALUE = exports.HEADER_NAME = exports.SECONDARY_HOST_ADDRESS = exports.HOST_ADDRESS = exports.BASE_PATH = void 0;
	var gaxios_1 = require_src$1();
	var jsonBigint = require_json_bigint();
	var gcp_residency_1 = require_gcp_residency();
	exports.BASE_PATH = "/computeMetadata/v1";
	exports.HOST_ADDRESS = "http://169.254.169.254";
	exports.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
	exports.HEADER_NAME = "Metadata-Flavor";
	exports.HEADER_VALUE = "Google";
	exports.HEADERS = Object.freeze({ [exports.HEADER_NAME]: exports.HEADER_VALUE });
	/**
	* Metadata server detection override options.
	*
	* Available via `process.env.METADATA_SERVER_DETECTION`.
	*/
	exports.METADATA_SERVER_DETECTION = Object.freeze({
		"assume-present": "don't try to ping the metadata server, but assume it's present",
		none: "don't try to ping the metadata server, but don't try to use it either",
		"bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
		"ping-only": "skip the BIOS probe, and go straight to pinging"
	});
	/**
	* Returns the base URL while taking into account the GCE_METADATA_HOST
	* environment variable if it exists.
	*
	* @returns The base URL, e.g., http://169.254.169.254/computeMetadata/v1.
	*/
	function getBaseUrl(baseUrl) {
		if (!baseUrl) baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports.HOST_ADDRESS;
		if (!/^https?:\/\//.test(baseUrl)) baseUrl = `http://${baseUrl}`;
		return new URL(exports.BASE_PATH, baseUrl).href;
	}
	function validate(options) {
		Object.keys(options).forEach((key) => {
			switch (key) {
				case "params":
				case "property":
				case "headers": break;
				case "qs": throw new Error("'qs' is not a valid configuration option. Please use 'params' instead.");
				default: throw new Error(`'${key}' is not a valid configuration option.`);
			}
		});
	}
	async function metadataAccessor(type, options, noResponseRetries = 3, fastFail = false) {
		options = options || {};
		if (typeof options === "string") options = { property: options };
		let property = "";
		if (typeof options === "object" && options.property) property = "/" + options.property;
		validate(options);
		try {
			const res = await (fastFail ? fastFailMetadataRequest : gaxios_1.request)({
				url: `${getBaseUrl()}/${type}${property}`,
				headers: Object.assign({}, exports.HEADERS, options.headers),
				retryConfig: { noResponseRetries },
				params: options.params,
				responseType: "text",
				timeout: requestTimeout()
			});
			if (res.headers[exports.HEADER_NAME.toLowerCase()] !== exports.HEADER_VALUE) throw new Error(`Invalid response from metadata service: incorrect ${exports.HEADER_NAME} header.`);
			else if (!res.data) throw new Error("Invalid response from the metadata service");
			if (typeof res.data === "string") try {
				return jsonBigint.parse(res.data);
			} catch (_a) {}
			return res.data;
		} catch (e) {
			const err = e;
			if (err.response && err.response.status !== 200) err.message = `Unsuccessful response status code. ${err.message}`;
			throw e;
		}
	}
	async function fastFailMetadataRequest(options) {
		const secondaryOptions = {
			...options,
			url: options.url.replace(getBaseUrl(), getBaseUrl(exports.SECONDARY_HOST_ADDRESS))
		};
		let responded = false;
		const r1 = (0, gaxios_1.request)(options).then((res) => {
			responded = true;
			return res;
		}).catch((err) => {
			if (responded) return r2;
			else {
				responded = true;
				throw err;
			}
		});
		const r2 = (0, gaxios_1.request)(secondaryOptions).then((res) => {
			responded = true;
			return res;
		}).catch((err) => {
			if (responded) return r1;
			else {
				responded = true;
				throw err;
			}
		});
		return Promise.race([r1, r2]);
	}
	/**
	* Obtain metadata for the current GCE instance
	*/
	function instance(options) {
		return metadataAccessor("instance", options);
	}
	exports.instance = instance;
	/**
	* Obtain metadata for the current GCP Project.
	*/
	function project(options) {
		return metadataAccessor("project", options);
	}
	exports.project = project;
	function detectGCPAvailableRetries() {
		return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
	}
	var cachedIsAvailableResponse;
	/**
	* Determine if the metadata server is currently available.
	*/
	async function isAvailable() {
		if (process.env.METADATA_SERVER_DETECTION) {
			const value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
			if (!(value in exports.METADATA_SERVER_DETECTION)) throw new RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
			switch (value) {
				case "assume-present": return true;
				case "none": return false;
				case "bios-only": return getGCPResidency();
				case "ping-only":
			}
		}
		try {
			if (cachedIsAvailableResponse === void 0) cachedIsAvailableResponse = metadataAccessor("instance", void 0, detectGCPAvailableRetries(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
			await cachedIsAvailableResponse;
			return true;
		} catch (e) {
			const err = e;
			if (process.env.DEBUG_AUTH) console.info(err);
			if (err.type === "request-timeout") return false;
			if (err.response && err.response.status === 404) return false;
			else {
				if (!(err.response && err.response.status === 404) && (!err.code || ![
					"EHOSTDOWN",
					"EHOSTUNREACH",
					"ENETUNREACH",
					"ENOENT",
					"ENOTFOUND",
					"ECONNREFUSED"
				].includes(err.code))) {
					let code = "UNKNOWN";
					if (err.code) code = err.code;
					process.emitWarning(`received unexpected error = ${err.message} code = ${code}`, "MetadataLookupWarning");
				}
				return false;
			}
		}
	}
	exports.isAvailable = isAvailable;
	/**
	* reset the memoized isAvailable() lookup.
	*/
	function resetIsAvailableCache() {
		cachedIsAvailableResponse = void 0;
	}
	exports.resetIsAvailableCache = resetIsAvailableCache;
	/**
	* A cache for the detected GCP Residency.
	*/
	exports.gcpResidencyCache = null;
	/**
	* Detects GCP Residency.
	* Caches results to reduce costs for subsequent calls.
	*
	* @see setGCPResidency for setting
	*/
	function getGCPResidency() {
		if (exports.gcpResidencyCache === null) setGCPResidency();
		return exports.gcpResidencyCache;
	}
	exports.getGCPResidency = getGCPResidency;
	/**
	* Sets the detected GCP Residency.
	* Useful for forcing metadata server detection behavior.
	*
	* Set `null` to autodetect the environment (default behavior).
	* @see getGCPResidency for getting
	*/
	function setGCPResidency(value = null) {
		exports.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
	}
	exports.setGCPResidency = setGCPResidency;
	/**
	* Obtain the timeout for requests to the metadata server.
	*
	* In certain environments and conditions requests can take longer than
	* the default timeout to complete. This function will determine the
	* appropriate timeout based on the environment.
	*
	* @returns {number} a request timeout duration in milliseconds.
	*/
	function requestTimeout() {
		return getGCPResidency() ? 0 : 3e3;
	}
	exports.requestTimeout = requestTimeout;
	__exportStar(require_gcp_residency(), exports);
}));
//#endregion
export { require_src as t };
