import authMiddleware from "@app-middlewares/auth";
import validator from "@app-middlewares/validator";
import authLib from "@app-modules/auth";
import { App } from "@app-types/app";
import { adminLoginValidation } from "@app-validations/auth";
import { verify } from "argon2";
import { Hono } from "hono";

const auth = new Hono<App>()
  .post("/login", validator("json", adminLoginValidation), async (c) => {
    const { email: admin, password } = await c.req.valid("json");

    if (!(await verify(admin.password, password))) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = await authLib().use("admin").generate(admin);

    return c.json({ data: { ...admin.serialize(), token } });
  })
  .get("/check", authMiddleware("admin"), (c) =>
    c.json({ data: c.var.auth.user?.serialize() })
  )
  .delete("/logout", authMiddleware("admin"), async (c) => {
    await c.var.auth.remove();

    return c.json({ data: c.var.auth.serialize() });
  });

export default auth;
