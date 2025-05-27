import db from "@app-modules/database.js";
import bootstrap from "@app-utils/bootstrap.js";
import { afterAll, beforeAll } from "bun:test";

const gracefullStop = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

beforeAll(async () => {
  await bootstrap(["Log", "Database", "Upload", "Auth", "Server"]);
});

afterAll(async () => {
  await gracefullStop();
  await db().source.dropDatabase();
  await db().source.destroy();
});
