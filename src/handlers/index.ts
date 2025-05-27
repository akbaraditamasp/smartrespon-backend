import log from "@app-modules/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { TypeORMError } from "typeorm";
import publicRoute from "./public";

const app = new Hono()
  .use(cors())
  .route("/public", publicRoute)
  .get((c) => c.text("Hello world"));

app.onError(async (err, c) => {
  if (err instanceof HTTPException)
    return c.json({ message: err.message }, err.status);

  if (err instanceof TypeORMError && err.name === "EntityNotFoundError") {
    return c.json({ message: "Entity not found" }, 404);
  }

  log().log.error(err);

  return c.json({ message: "Internal error" }, 500);
});

export default app;
