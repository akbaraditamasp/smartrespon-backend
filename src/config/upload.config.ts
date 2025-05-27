import { createConfig } from "@app-utils/upload";
import BunUpload from "@app-utils/upload_driver";

export default createConfig({
  drivers: {
    bun: BunUpload,
  },
});
