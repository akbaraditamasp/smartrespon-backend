import { UploadDriver } from "@app-types/upload";

type UploadDriverConstructor = new (...args: any[]) => UploadDriver;

export function createConfig<
  Keys extends string,
  Drivers extends Record<Keys, UploadDriverConstructor>
>(config: { drivers: Drivers }) {
  return config;
}
