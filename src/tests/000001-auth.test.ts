import User from "@app-entities/user";
import app from "@app-handlers/index";
import { faker } from "@faker-js/faker";
import { describe, expect, test } from "bun:test";
import { testClient } from "hono/testing";

const client = testClient(app);

describe("User Auth", async () => {
  const password = faker.internet.password();

  let token: string;

  test("User registration", async () => {
    const response = await client.public.auth.register.$post({
      json: {
        email: faker.internet.email(),
        fullname: faker.person.fullName(),
        password,
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.data.token).toBeString();

    token = body.data.token;
  });

  test("User login using email", async () => {
    const user = (await User.find({ take: 1 }))[0];

    const response = await client.public.auth.login.$post({
      json: {
        email: user.email,
        password,
      },
    });

    expect(response.status).toBe(200);
  });

  test("User check token", async () => {
    const response = await client.public.auth["check"].$get(
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });

  test("User logout", async () => {
    const response = await client.public.auth.logout.$delete(
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
  });
});
