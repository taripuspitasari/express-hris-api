import supertest from "supertest";
import {web} from "../src/application/web";
import {AttendanceTest, UserTest} from "./test-util";
import {logger} from "../src/application/logging";
import {User} from "@prisma/client";

describe("POST /api/attendance/check-in", () => {
  let currentUser: User;

  beforeEach(async () => {
    await UserTest.create();
    currentUser = await UserTest.get();
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll(currentUser.id);
    await UserTest.delete();
  });

  it("should allow the user to check in and return a success message", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-in")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should fail to check in if the user is not authenticated", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-in")
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("POST /api/attendance/check-out", () => {
  let currentUser: User;

  beforeEach(async () => {
    await UserTest.create();
    currentUser = await UserTest.get();
    await AttendanceTest.checkIn(currentUser);
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll(currentUser.id);
    await UserTest.delete();
  });

  it("should allow the user to check out and return a success message", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should fail to check in if the user is not authenticated", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/attendance/history", () => {
  let currentUser: User;

  beforeEach(async () => {
    await UserTest.create();
    currentUser = await UserTest.get();
    await AttendanceTest.checkIn(currentUser);
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll(currentUser.id);
    await UserTest.delete();
  });

  it("should return 200 and the list of attendances for the authenticated user", async () => {
    const response = await supertest(web)
      .get("/api/attendance/history")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});
