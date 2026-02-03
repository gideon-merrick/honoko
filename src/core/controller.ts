import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";
import { auth } from "../lib/auth.js";
import type { AppType } from "./app-variables.js";

export abstract class AbstractController {
  public router = new Hono<AppType>();
  public abstract path: string;

  protected ok(c: Context, data: unknown, code: ContentfulStatusCode = 200) {
    return c.json({ success: true, data: data }, code);
  }

  protected fail(c: Context, fields: Record<string, string[]>, code: ContentfulStatusCode = 500) {
    return c.json({ success: false, errors: fields }, code);
  }

  protected validateUsing<T extends z.ZodType>(schema: T) {
    return zValidator("json", schema, (result, c) => {
      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".") || "root";
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        return c.json({ success: false, errors: errors }, 401);
      }
    });
  }

  protected createAuthMiddleware() {
    return createMiddleware(async (c, next) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        c.set("user", null);
        c.set("session", null);
        await next();
        return;
      }
      c.set("user", session.user);
      c.set("session", session.session);
      await next();
    });
  }

  public abstract mount(): void;
}
