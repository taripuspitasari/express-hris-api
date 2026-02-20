import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util/user";

describe("POST /api/auth/register", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  beforeEach(async () => {
    await UserTest.delete();
  });

  it("should create a new user and return 201 with user data", async () => {
    const response = await supertest(web).post("/api/auth/register").send({
      fullname: "test",
      email: "test@gmail.com",
      password: "test_123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "User registered successfully. Please login.",
    );
  });

  it("should reject and return 400 if the request body is invalid", async () => {
    const response = await supertest(web).post("/api/auth/register").send({
      fullname: "",
      email: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject and return 400 if email is already registered", async () => {
    await supertest(web).post("/api/auth/register").send({
      fullname: "test",
      email: "test@gmail.com",
      password: "test_123",
    });

    const response = await supertest(web).post("/api/auth/register").send({
      fullname: "test duplicate",
      email: "test@gmail.com",
      password: "test_321",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBe("A user with this email already exists.");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and a token when credentials are valid", async () => {
    const response = await supertest(web).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "test_123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.profile.email).toBe("test@gmail.com");
    expect(response.body.data.profile.fullname).toBe("Test User");
    expect(response.body.data.roles).toEqual(["employee"]);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.message).toBe("Login successfully");
  });

  it("should return 401 when email does not exist", async () => {
    const response = await supertest(web).post("/api/auth/login").send({
      email: "wrong@gmail.com",
      password: "test_salah",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 when password is incorrect", async () => {
    const response = await supertest(web).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "wrong_123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/auth/me", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and the authenticated user's data when token is valid", async () => {
    const response = await supertest(web)
      .get("/api/auth/me")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.profile.email).toBe("test@gmail.com");
    expect(response.body.data.profile.fullname).toBe("Test User");
    expect(response.body.data.roles).toEqual(["employee"]);
  });

  it("should return 401 when token is invalid", async () => {
    const response = await supertest(web)
      .get("/api/auth/me")
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/auth/update-profile", () => {
  beforeEach(async () => {
    await UserTest.delete();
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and update the user's data when token and input are valid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/update-profile")
      .set("Authorization", "test")
      .send({
        email: "testupdate@gmail.com",
        fullname: "test update",
        phone: "08999998812",
        birth_date: "1995-12-12",
        gender: "female",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.profile.email).toBe("testupdate@gmail.com");
    expect(response.body.data.profile.fullname).toBe("test update");
    expect(response.body.data.profile.phone).toBe("08999998812");
    expect(response.body.data.profile.birth_date).toBe("1995-12-12");
    expect(response.body.data.profile.gender).toBe("female");
    expect(response.body.message).toBe("Profile updated successfully");
  });

  it("should return 400 when the request body is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/update-profile")
      .set("Authorization", "test")
      .send({
        email: "wrong-email",
        fullname: "",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 when the token is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/update-profile")
      .set("Authorization", "wrong")
      .send({
        email: "testupdate@gmail.com",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/auth/change-password", () => {
  beforeEach(async () => {
    await UserTest.delete();
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and change password the user's when token and input are valid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/change-password")
      .set("Authorization", "test")
      .send({
        old_password: "test_123",
        new_password: "test_678",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password updated successfully");

    const checkMe = await supertest(web)
      .get("/api/auth/me")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(checkMe.status).toBe(401);
  });

  it("should return 401 when the request body is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/change-password")
      .set("Authorization", "test")
      .send({
        old_password: "wrong_123",
        new_password: "test_678",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 401 when the token is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/auth/change-password")
      .set("Authorization", "wrong")
      .send({
        old_password: "test_123",
        new_password: "test_678",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/auth/logout", () => {
  beforeEach(async () => {
    await UserTest.delete();
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should return 200 and successfully log out the user when token is valid", async () => {
    const response = await supertest(web)
      .delete("/api/auth/logout")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");

    const checkMe = await supertest(web)
      .get("/api/auth/me")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(checkMe.status).toBe(401);
  });

  it("should return 401 when token is invalid", async () => {
    const response = await supertest(web)
      .delete("/api/auth/logout")
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
