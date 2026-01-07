import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import type { z } from "zod";
import type { AppVariables } from "../types";

export abstract class BaseHonokoController {
  public router = new Hono<{ Variables: AppVariables }>();
  public abstract path: string;

  protected ok(c: Context, data: unknown) {
    return c.json({ success: true, data: data }, 200);
  }

  protected fail(c: Context, fields: Record<string, string[]>) {
    return c.json({ success: false, errors: fields }, 400);
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

  public abstract mount(): void;
}
