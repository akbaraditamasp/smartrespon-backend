import app from "@app-handlers/index";
import expo from "@app-modules/expo";
import log from "@app-modules/logger.js";
import server from "@app-modules/server.js";
import bootstrap from "@app-utils/bootstrap.js";
import "dotenv/config";
import "reflect-metadata";

bootstrap(["Log", "Database", "Upload", "Auth", "Server", "Expo"])
  .then(async () => {
    await server().start(app);
    await expo().start();
  })
  .catch((e) => {
    log().log.error((e as Error).message);
    process.exit(1);
  });
