import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should create a new user and return 201 with user data", async () => {
    const response = await supertest(web).post("/api/users").send({
      email: "test@gmail.com",
      password: "test",
      name: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.role).toBe("applicant");
    expect(response.body.message).toBe("Registration successful.");
  });

  it("should reject and return 400 if the request body is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      email: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and a token when credentials are valid", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.role).toBe("applicant");
    expect(response.body.data.token).toBeDefined();
    expect(response.body.message).toBe("Login successful.");
  });

  it("should return 401 when email does not exist", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "wrong@gmail.com",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 when password is incorrect", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "wrong",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and the authenticated user's data when token is valid", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe("test@gmail.com");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.role).toBe("applicant");
  });

  it("should return 401 when token is invalid", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "wrong");

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
    await UserTest.deleteForUpdate();
  });

  it("should return 200 and update the user's data when token and input are valid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        email: "testupdate@gmail.com",
        password: "testupdate",
        name: "test update",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe("testupdate@gmail.com");
    expect(response.body.data.name).toBe("test update");
    expect(response.body.data.role).toBe("applicant");
    expect(response.body.message).toBe("Update successful.");
  });

  it("should return 400 when the request body is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        email: "",
        password: "",
        name: "",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 when the token is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "wrong")
      .send({
        email: "testupdate@gmail.com",
        password: "test update",
        name: "test update",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and successfully log out the user when token is valid", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful.");

    const user = await UserTest.get();
    expect(user.token).toBe(null);
  });

  it("should return 401 when token is invalid", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
