import Admin from "@app-entities/admin";
import AdminToken from "@app-entities/admin_token";
import User from "@app-entities/user";
import UserToken from "@app-entities/user_token";
import { createConfig } from "@app-utils/auth";

export default createConfig({
  guards: {
    user: {
      user: User,
      token: UserToken,
    },
    admin: {
      user: Admin,
      token: AdminToken,
    },
  },
  defaultGuard: "user",
});
