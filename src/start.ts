import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const apiProtectionMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Browsers always send sec-fetch-site, origin, or referer on requests.
  // API tools like Postman/cURL do not send these by default.
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");
  
  // We exclude GET requests just in case someone is navigating directly, 
  // though server functions are mostly POST.
  if (request.method !== "GET" && !origin && !referer && !secFetchSite) {
    return new Response("Direct API access via tools like Postman is forbidden.", { status: 403 });
  }

  return await next();
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, apiProtectionMiddleware, csrfMiddleware],
}));
