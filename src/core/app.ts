import { serve } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AbstractController } from "./controller";

export class App {
  public instance: Hono;

  constructor(controllers: AbstractController[]) {
    this.instance = new Hono();
    this.instance.use(logger());
    this.setupError();
    this.setupNotFound();
    this.mount(controllers);
  }

  private setupError() {
    this.instance.onError((error, c) => {
      console.error(error);
      return c.json({
        success: false,
        errors: { server: ["Internal server error"] },
      });
    });
  }

  private setupNotFound() {
    this.instance.notFound((c) => {
      return c.json({
        success: false,
        errors: { server: ["Route not found"] },
      });
    });
  }

  private mount(controllers: AbstractController[]) {
    controllers.forEach((controller) => {
      controller.mount();
      this.instance.route(controller.path, controller.router);
    });
  }

  public listen(port: number) {
    serve({
      port: port || 3000,
      fetch: this.instance.fetch,
    });
  }
}
