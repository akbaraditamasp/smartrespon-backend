import { getIPv4Addresses } from "@app-utils/get-ip";
import { $ } from "bun";
import qrcode from "qrcode-terminal";

export class Expo {
  private static instance: Expo;
  private port!: number;

  private constructor() {
    this.port = Number(process.env.PORT ?? 3000);
  }

  public static getInstance() {
    if (!Expo.instance) throw new Error("Expo not booted yet");

    return Expo.instance;
  }

  public static boot() {
    Expo.instance = new Expo();
  }

  public async start() {
    await Bun.write(
      "./.env",
      `EXPO_PUBLIC_BASE_URL=http://${getIPv4Addresses()[0].address}:${
        this.port
      }`
    );

    qrcode.generate(`exp://${getIPv4Addresses()[0].address}:8081`, {
      small: true,
    });
    await $`bun start`;
  }
}

const expo = Expo.getInstance;
export default expo;
