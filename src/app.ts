import { Honoko } from "./core/honoko.js";
import { AuthController } from "./modules/auth/controller.js";

export const app = new Honoko({
	controllers: [new AuthController()],
});
