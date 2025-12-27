import { Hono } from "hono";
import { APIError } from "./api-error";
import type { Controller } from "./controller";

export class App {
  public instance: Hono;

  constructor(controllers: Controller[]) {
    this.instance = new Hono();
    this.setupErrors();
    this.mount(controllers);
  }

  private setupErrors() {
    this.instance.onError((error, c) => {
      console.error(`[error]: ${error.message}`);
      if (error instanceof APIError) {
        return c.json({ success: false, errors: error.fields || { server: [error.message] } });
      }
      return c.json({ success: false, errors: { server: "Internal server error" } });
    });
  }

  private mount(controllers: Controller[]) {
    controllers.forEach((controller) => {
      controller.mount();
      this.instance.route(controller.path, controller.router);
    });
  }
}
