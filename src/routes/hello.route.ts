import { Hono } from "hono";

export const helloRoute = new Hono()
  .get("/", (c) => {
    return c.json({ success: true, data: { message: "Hello, World!" } });
  })
  .get("/:name", (c) => {
    const name = c.req.param("name");
    return c.json({ success: true, data: { message: `Hello, ${name}!` } });
  });
