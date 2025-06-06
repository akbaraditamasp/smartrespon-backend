import log from "@app-modules/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { TypeORMError } from "typeorm";
import publicRoute from "./public";
import auth from "./auth";
import complaint from "./complaint";
import { serveStatic } from "hono/bun";
import stats from "./stats";

const app = new Hono()
  .use(cors())
  .use("/uploads/*", serveStatic({ root: "./" }))
  .use("/admin/*", serveStatic({ root: "./" }))
  .route("/auth", auth)
  .route("/stats", stats)
  .route("/complaint", complaint)
  .route("/public", publicRoute)
  .get("/admin/*", async (c) => {
    const html = await Bun.file("./admin/index.html").text();

    return c.html(html);
  })
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
