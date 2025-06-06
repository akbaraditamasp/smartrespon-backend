import Complaint from "@app-entities/complaint";
import User from "@app-entities/user";
import auth from "@app-middlewares/auth";
import db from "@app-modules/database";
import { App } from "@app-types/app";
import { Hono } from "hono";
import { DateTime } from "luxon";

const stats = new Hono<App>().use(auth("admin")).get("/", async (c) => {
  const usersCount = await User.count();
  const complaintsCount = await Complaint.count();

  const chartLength = 10;
  const charts = Array(chartLength)
    .fill(null)
    .map((_, index) => ({
      date: DateTime.now().minus({ days: index }),
      allCount: 0,
      resolvedCount: 0,
    }))
    .reverse();

  const allChartsData = await db()
    .source.createQueryBuilder()
    .from("complaints", "complaint")
    .addSelect("DATE(complaint.createdAt)", "date")
    .addSelect("COUNT(*)", "count")
    .groupBy("DATE(complaint.createdAt)")
    .orderBy("DATE(complaint.createdAt)")
    .where("complaint.createdAt >= :date", {
      date: charts[0].date.toSQLDate(),
    })
    .getRawMany();

  const resolvedChartsData = await db()
    .source.createQueryBuilder()
    .from("complaints", "complaint")
    .addSelect("DATE(complaint.createdAt)", "date")
    .addSelect("COUNT(*)", "count")
    .groupBy("DATE(complaint.createdAt)")
    .orderBy("DATE(complaint.createdAt)")
    .where("complaint.createdAt >= :date AND complaint.status = :status", {
      date: charts[0].date.toSQLDate(),
      status: "RESOLVED",
    })
    .getRawMany();

  return c.json({
    data: {
      usersCount,
      complaintsCount,
      charts: charts.map((item) => {
        const all = allChartsData.find((el) =>
          DateTime.fromJSDate(el.date).hasSame(item.date, "day")
        );
        const resolved = resolvedChartsData.find((el) =>
          DateTime.fromJSDate(el.date).hasSame(item.date, "day")
        );

        return {
          ...item,
          allCount: all?.count || 0,
          resolvedCount: resolved?.count || 0,
        };
      }),
    },
  });
});

export default stats;
