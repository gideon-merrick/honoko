import { Hono } from "hono";
import { logger } from "hono/logger";
import type { Controller } from "./controller";

export class App {
  public instance: Hono;

  constructor(controllers: Controller[]) {
    this.instance = new Hono();
    this.instance.use(logger());
    this.setupErrors();
    this.mount(controllers);
  }

  private setupErrors() {
    this.instance.onError((error, c) => {
      return c.json({
        success: false,
        errors: { server: error.message || "Internal server error" },
      });
    });
  }

  private mount(controllers: Controller[]) {
    controllers.forEach((controller) => {
      controller.mount();
      this.instance.route(controller.path, controller.router);
    });
  }
}
