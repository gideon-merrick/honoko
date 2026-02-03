import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import type { z } from "zod";
import type { AppVariables, CurrentUser } from "../types";

export abstract class AbstractController {
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

  protected createAuthMiddleware() {
    return createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
      const authHeader = c.req.header("Authorization");
      if (!authHeader) return this.fail(c, { auth: ["Authorization header missing"] });
      const token = authHeader.replace("Bearer ", "");
      if (!token) return this.fail(c, { auth: ["Token missing"] });
      try {
        const payload = await verify(token, String(process.env.JWT_SECRET), { alg: "HS256" });
        c.set("currentUser", payload as CurrentUser);
        await next();
      } catch {
        return this.fail(c, { auth: ["Invalid or expired token"] });
      }
    });
  }

  protected currentUser(c: Context<{ Variables: AppVariables }>): CurrentUser {
    return c.get("currentUser");
  }

  protected async generateToken<T>(payload: T) {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      String(process.env.JWT_SECRET),
    );
  }

  public abstract mount(): void;
}
