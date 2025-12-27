import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { z } from "zod";

export abstract class Controller {
  public router = new Hono();
  public abstract path: string;

  protected ok(c: Context, data: unknown) {
    return c.json({ success: true, data: data });
  }

  protected fail(c: Context, fields: Record<string, string[]>) {
    return c.json({ success: false, errors: fields });
  }

  protected createValidator<T extends z.ZodType>(schema: T) {
    return zValidator("json", schema, (result, c) => {
      if (!result.success) {
        const errors = z.flattenError(result.error).fieldErrors;
        return c.json({ success: false, errors: errors });
      }
    });
  }

  public abstract mount(): void;
}
