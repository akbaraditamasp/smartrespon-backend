import Complaint from "@app-entities/complaint";
import auth from "@app-middlewares/auth";
import validator from "@app-middlewares/validator";
import { App } from "@app-types/app";
import { uuidEntityParam } from "@app-validations/general";
import { Hono } from "hono";
import { z } from "zod";

const complaint = new Hono<App>()
  .use(auth("admin"))
  .patch(
    "/:entity",
    validator("param", uuidEntityParam(Complaint, "id")),
    validator(
      "json",
      z.object({
        status: z.enum([
          "SENT",
          "HANDLED",
          "ON_PROGRESS",
          "RECEIVED",
          "RESOLVED",
        ]),
      })
    ),
    async (c) => {
      const complaint = await c.req.valid("param");
      complaint.status = (await c.req.valid("json")).status;
      await complaint.save();

      return c.json({ data: (await c.req.valid("param")).serialize() });
    }
  )
  .delete(
    "/:entity",
    validator(
      "param",
      uuidEntityParam(Complaint, "id", {
        modelOptions: {
          relations: {
            pics: true,
          },
        },
      })
    ),
    async (c) => {
      const complaint = await c.req.valid("param");
      await complaint.remove();

      return c.json({ data: complaint.serialize() });
    }
  )
  .get(
    "/:entity",
    validator(
      "param",
      uuidEntityParam(Complaint, "id", {
        modelOptions: {
          relations: {
            pics: true,
            user: true,
          },
        },
      })
    ),
    async (c) => {
      return c.json({ data: (await c.req.valid("param")).serialize() });
    }
  )
  .get("/", async (c) => {
    const complaints = await Complaint.find({
      relations: {
        user: true,
      },
    });

    return c.json({
      data: complaints.map((complaint) => complaint.serialize()),
    });
  });

export default complaint;
