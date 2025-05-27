import Complaint from "@app-entities/complaint";
import User from "@app-entities/user";
import app from "@app-handlers/index";
import auth from "@app-modules/auth";
import { faker } from "@faker-js/faker";
import { describe, expect, test } from "bun:test";
import { testClient } from "hono/testing";
import makeImage from "./file";

const client = testClient(app);

describe("Complaint API", async () => {
  const user = (await User.find({ take: 1 }))[0];
  const token = await auth().use("user").generate(user);

  test("Create complaint", async () => {
    const response = await client.public.complaint.$post(
      {
        form: {
          title: faker.lorem.word(),
          description: faker.lorem.paragraph(),
          address: faker.location.streetAddress(),
          "coordinates[latitude]": `${faker.location.latitude()}`,
          "coordinates[longitude]": `${faker.location.longitude()}`,
          "pics[]": await makeImage(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("Update complaint", async () => {
    const complaint = (
      await Complaint.find({
        where: { userId: user.id },
        relations: {
          pics: true,
        },
      })
    )[0];

    const response = await client.public.complaint[":entity"].$put(
      {
        param: {
          entity: complaint.id,
        },
        form: {
          title: faker.lorem.word(),
          description: faker.lorem.paragraph(),
          address: faker.location.streetAddress(),
          "coordinates[latitude]": `${faker.location.latitude()}`,
          "coordinates[longitude]": `${faker.location.longitude()}`,
          "pics[]": [
            ...(complaint.pics || []).map((item) => item.id),
            await makeImage(),
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });
});
