import { App } from "@app-types/app";
import { Hono } from "hono";
import auth from "./auth";
import complaint from "./complaint";

const publicRoute = new Hono<App>()
  .route("/auth", auth)
  .route("/complaint", complaint);

export default publicRoute;
