import Complaint from "@app-entities/complaint";
import ComplaintPic from "@app-entities/complaint_pic";
import auth from "@app-middlewares/auth";
import validator from "@app-middlewares/validator";
import db from "@app-modules/database";
import { App } from "@app-types/app";
import { composeComplaintValidation } from "@app-validations/complaint";
import { uuidEntityParam } from "@app-validations/general";
import { Hono } from "hono";
import { In, Not } from "typeorm";

const complaint = new Hono<App>()
  .use(auth("user"))
  .put(
    "/:entity",
    validator("param", uuidEntityParam(Complaint, "id")),
    validator("form", composeComplaintValidation),
    async (c) => {
      const { pics, ...data } = await c.req.valid("form");
      const complaint = (await c.req.valid("param")).assign(data);

      if (complaint.userId !== c.var.auth.userId || complaint.status !== "SENT")
        return c.json({ message: "Not allowed" }, 403);
      await complaint.save();

      complaint.pics = pics
        .filter((item) => item.complaintId === complaint.id)
        .concat(
          await db()
            .source.getRepository(ComplaintPic)
            .save(
              pics
                .filter((item) => !item.id)
                .map((item) => {
                  item.complaintId = complaint.id;

                  return item;
                })
            )
        );

      await db()
        .source.getRepository(ComplaintPic)
        .delete({
          id: Not(In(complaint.pics.map((item) => item.id))),
        });

      return c.json({ data: complaint.serialize() });
    }
  )
  .get("/:id", async (c) => {
    const complaint = await Complaint.findOneByOrFail({
      userId: c.var.auth.userId,
      id: c.req.param("id"),
    });

    return c.json({ data: complaint });
  })
  .post("/", validator("form", composeComplaintValidation), async (c) => {
    const { pics, ...data } = await c.req.valid("form");
    const complaint = Complaint.from({ ...data, status: "SENT" });
    complaint.pics = pics;
    complaint.user = c.var.auth.user!;
    await complaint.save();

    return c.json({ data: complaint.serialize() });
  })
  .get("/", async (c) => {
    const complaints = await Complaint.find({
      where: {
        userId: c.var.auth.userId,
      },
    });

    return c.json({ data: complaints.map((item) => item.serialize()) });
  });

export default complaint;
