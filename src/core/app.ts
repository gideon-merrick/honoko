import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AbstractController } from "./controller";

export class App {
  public instance: Hono;

  constructor(controllers: AbstractController[]) {
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

  private mount(controllers: AbstractController[]) {
    controllers.forEach((controller) => {
      controller.mount();
      this.instance.route(controller.path, controller.router);
    });
  }
}
