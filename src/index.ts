import app from "@app-handlers/index";
import log from "@app-modules/logger.js";
import server from "@app-modules/server.js";
import bootstrap from "@app-utils/bootstrap.js";
import "dotenv/config";
import "reflect-metadata";

bootstrap(["Log", "Database", "Upload", "Auth", "Server"])
  .then(() => {
    server().start(app);
  })
  .catch((e) => {
    log().log.error((e as Error).message);
    process.exit(1);
  });
