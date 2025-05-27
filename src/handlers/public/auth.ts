import User from "@app-entities/user";
import validator from "@app-middlewares/validator";
import { App } from "@app-types/app";
import {
  publicLoginValidation,
  publicRegisterValidation,
} from "@app-validations/auth";
import { Hono } from "hono";
import authLib from "@app-modules/auth";
import { verify } from "argon2";
import authMiddleware from "@app-middlewares/auth";

const auth = new Hono<App>()
  .post("/register", validator("json", publicRegisterValidation), async (c) => {
    const { password: plainPassword, ...data } = await c.req.json();
    const user = await User.from({ ...data, plainPassword }).save();
    const token = await authLib().use("user").generate(user);

    return c.json({
      data: {
        ...user.serialize(),
        token,
      },
    });
  })
  .post("/login", validator("json", publicLoginValidation), async (c) => {
    const { email: user, password } = await c.req.valid("json");

    if (!(await verify(user.password, password))) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = await authLib().use("user").generate(user);

    return c.json({ data: { ...user.serialize(), token } });
  })
  .get("/check", authMiddleware("user"), (c) =>
    c.json({ data: c.var.auth.user?.serialize() })
  )
  .delete("/logout", authMiddleware("user"), async (c) => {
    await c.var.auth.remove();

    return c.json({ data: c.var.auth.serialize() });
  });

export default auth;
