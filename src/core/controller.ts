import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { z } from "zod";
import type { AppVariables } from "../types";

export abstract class Controller {
  public router = new Hono<{ Variables: AppVariables }>();
  public abstract path: string;

  protected ok(c: Context, data: unknown) {
    return c.json({ success: true, data: data }, 200);
  }

  protected fail(c: Context, fields: Record<string, string[]>) {
    return c.json({ success: false, errors: fields }, 400);
  }

  protected createValidator<T extends z.ZodType>(schema: T) {
    return zValidator("json", schema, (result, c) => {
      if (!result.success) {
        const errors = z.flattenError(result.error).fieldErrors;
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
        const payload = await verify(token, String(process.env.JWT_SECRET));
        c.set("user", payload);
        await next();
      } catch {
        return this.fail(c, { auth: ["Invalid or expired token"] });
      }
    });
  }

  protected async generateToken(payload: JWTPayload) {
    return await sign(payload, String(process.env.JWT_SECRET));
  }

  public abstract mount(): void;
}
