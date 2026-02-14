import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handleError } from "./lib/handle-error.js";
import { handleNotFound } from "./lib/handle-notfound.js";
import type { AppVariables } from "./lib/types.js";
import { helloRoute } from "./routes/hello.route.js";

export const app = new Hono<AppVariables>()
  .basePath("/api")
  .onError(handleError)
  .notFound(handleNotFound)
  .use(logger())
  .use(cors())
  .route("/hello", helloRoute);
