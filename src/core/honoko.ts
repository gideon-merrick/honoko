import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AppType } from "./app-variables.js";
import type { AbstractController } from "./controller.js";

type HonokoOptions = {
  controllers: AbstractController[];
};

export class Honoko {
  public instance: Hono<AppType>;

  constructor(options: HonokoOptions) {
    this.instance = new Hono<AppType>().basePath("/api");
    this.instance.use(logger());
    this.setupError();
    this.setupNotFound();
    this.mount(options.controllers);
  }

  private setupError() {
    this.instance.onError((error, c) => {
      console.error(error);
      return c.json(
        {
          success: false,
          errors: { server: ["Internal server error"] },
        },
        500,
      );
    });
  }

  private setupNotFound() {
    this.instance.notFound((c) => {
      return c.json(
        {
          success: false,
          errors: { server: ["Route not found"] },
        },
        404,
      );
    });
  }

  private mount(controllers: AbstractController[]) {
    controllers.forEach((controller) => {
      controller.mount();
      this.instance.route(controller.path, controller.router);
      controller.router.routes.forEach((route) => {
        console.log(`[Route] ${route.method.padEnd(7)} ${controller.path}${route.path}`);
      });
    });
  }

  public listen(port: number) {
    serve({
      port: port || 3000,
      hostname: "0.0.0.0",
      fetch: this.instance.fetch,
    });
  }
}
