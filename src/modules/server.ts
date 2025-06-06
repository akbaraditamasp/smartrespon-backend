import type { Hono } from "hono";
import log from "./logger";
import { getIPv4Addresses } from "@app-utils/get-ip";
import { $ } from "bun";
import qrcode from "qrcode-terminal";

export class Server {
  private static instance: Server;
  private port!: number;
  private app!: Hono;

  private constructor() {
    this.port = Number(process.env.PORT ?? 3000);
  }

  public static getInstance() {
    if (!Server.instance) throw new Error("Server not booted yet");

    return Server.instance;
  }

  public static boot() {
    Server.instance = new Server();
  }

  public getApp() {
    return this.app;
  }

  public async start(app: Hono) {
    this.app = app;

    Bun.serve({
      fetch: this.app.fetch,
      port: 3000,
    });

    log().log.info(`🚀 Server berjalan ngab.`);
  }
}

const server = Server.getInstance;
export default server;
