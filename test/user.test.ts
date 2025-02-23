import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject new register if request is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      name: "",
      email: "",
      password: "",
    });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user", async () => {
    const response = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@gmail.com",
      password: "test",
    });
    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.role).toBe("APPLICANT");
  });

  it("should reject register if email is already taken", async () => {
    await UserTest.create();
    const response = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@gmail.com",
      password: "test",
    });
    logger.debug(response.body);
    expect(response.status).toBe(409);
    expect(response.body.errors).toBe("Email is already taken.");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.role).toBe("APPLICANT");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login user if email is invalid", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "notfound@gmail.com",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBe("User with this email didn't exists.");
  });

  it("should reject login user if password is invalid", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "wrongpassword",
    });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBe("Invalid email or password.");
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.role).toBe("APPLICANT");
  });

  it("should reject get user if token is invalid", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "wrongtoken");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject update user if request is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        email: "",
        password: "",
        name: "",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject update user if token is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "salah")
      .send({
        email: "emailupdate@gmail.com",
        password: "updatePassword",
        name: "updateName",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to update user name", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        name: "updateName",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("updateName");
  });

  it("should be able to update user password", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: "updatePassword",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);

    const user = await UserTest.get();
    expect(await bcrypt.compare("updatePassword", user.password)).toBe(true);
  });

  it("should be able to update user email", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        email: "updateEmail@gmail.com",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);

    expect(response.body.data.email).toBe("updateEmail@gmail.com");
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to logout", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully logged out.");

    const user = await UserTest.get();
    expect(user.token).toBeNull();
  });

  it("should reject logout user if token is wrong", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
