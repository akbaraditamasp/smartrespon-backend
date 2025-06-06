import Complaint from "@app-entities/complaint";
import User from "@app-entities/user";
import app from "@app-handlers/index";
import auth from "@app-modules/auth";
import { faker } from "@faker-js/faker";
import { describe, expect, test } from "bun:test";
import { testClient } from "hono/testing";
import makeImage from "./file";
import Admin from "@app-entities/admin";

const client = testClient(app);

describe("Complaint API", async () => {
  const user = (await User.find({ take: 1 }))[0];
  const token = await auth().use("user").generate(user);
  const admin = (await Admin.find({ take: 1 }))[0];
  const adminToken = await auth().use("admin").generate(admin);

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

  test("Get complaint by id", async () => {
    const complaint = (
      await Complaint.find({
        where: { userId: user.id },
        relations: {
          pics: true,
        },
      })
    )[0];

    const response = await client.public.complaint[":id"].$get(
      {
        param: {
          id: complaint.id,
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

  test("Get complaint list", async () => {
    const response = await client.public.complaint.$get(
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("Delete complaint by id", async () => {
    const complaint = (
      await Complaint.find({
        where: { userId: user.id },
        relations: {
          pics: true,
        },
      })
    )[0];

    const response = await client.public.complaint[":id"].$delete(
      {
        param: {
          id: complaint.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);

    const responseCreate = await client.public.complaint.$post(
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

    expect(responseCreate.status).toBe(200);
  });

  test("Admin get complaint list", async () => {
    const response = await client.complaint.$get(
      {},
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("Admin get complaint by id", async () => {
    const complaint = (
      await Complaint.find({
        where: { userId: user.id },
        relations: {
          pics: true,
        },
      })
    )[0];

    const response = await client.complaint[":entity"].$get(
      {
        param: {
          entity: complaint.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("Admin update complaint status", async () => {
    const complaint = (await Complaint.find({}))[0];

    const response = await client.complaint[":entity"].$patch(
      {
        param: {
          entity: complaint.id,
        },
        json: {
          status: "RECEIVED",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("Admin delete complaint", async () => {
    const complaint = (await Complaint.find({}))[0];

    const response = await client.complaint[":entity"].$delete(
      {
        param: {
          entity: complaint.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });
});
