import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";

export abstract class AbstractController {
  public routes = new Hono();
  public abstract readonly path: string;

  abstract setupRoutes(): void;

  constructor() {
    this.setupRoutes();
  }

  protected ok(c: Context, result: unknown, status: ContentfulStatusCode = 200) {
    return c.json({ result }, status);
  }

  protected err(c: Context, message: string, status: ContentfulStatusCode = 400) {
    return c.json({ error: message }, status);
  }

  protected validator<T extends z.ZodType>(schema: T) {
    return zValidator("json", schema, (result, c) => {
      if (!result.success) {
        const formattedErrors = result.error.issues.map((issue) => ({
          [issue.path.join(".") || "body"]: {
            message: issue.message,
          },
        }));
        return c.json({ errors: formattedErrors }, 400);
      }
    });
  }
}
