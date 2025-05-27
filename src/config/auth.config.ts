import User from "@app-entities/user";
import UserToken from "@app-entities/user_token";
import { createConfig } from "@app-utils/auth";

export default createConfig({
  guards: {
    user: {
      user: User,
      token: UserToken,
    },
  },
  defaultGuard: "user",
});
