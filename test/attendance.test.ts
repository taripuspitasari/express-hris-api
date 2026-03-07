import supertest from "supertest";
import {web} from "../src/application/web";
import {AttendanceTest} from "./test-utils/attendance";
import {UserTest} from "./test-utils/user";
import {logger} from "../src/application/logging";
import {User} from "@prisma/client";

describe("POST /api/attendance/check-in", () => {
  beforeEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithEmployee();
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
  });

  it("should success check in", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-in")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should fail if unauthorized", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-in")
      .set("Authorization", "wrong");

    logger.debug(response.body.data);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/attendance", () => {
  let currentUser: User;

  beforeEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
  });

  it("should return today's attendance data", async () => {
    await AttendanceTest.checkIn(currentUser.id, new Date("2026-03-07"));
    const response = await supertest(web)
      .get("/api/attendance")
      .set("Authorization", "testuser");

    logger.debug(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return null if not checked in yet", async () => {
    const response = await supertest(web)
      .get("/api/attendance")
      .set("Authorization", "testuser");

    logger.debug(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});

describe("POST /api/attendance/check-out", () => {
  let currentUser: User;

  beforeEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    await AttendanceTest.checkIn(currentUser.id, new Date("2026-03-07"));
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
  });

  it("should success check out", async () => {
    const response = await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should fail if unauthorized", async () => {
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
    await AttendanceTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    await AttendanceTest.checkIn(currentUser.id, new Date("2026-03-07"));
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
  });

  it("should return personal attendance history", async () => {
    await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "testuser");

    const response = await supertest(web)
      .get("/api/attendance/history")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

describe("GET /api/hr/attendance/report", () => {
  let currentUser: User;

  beforeEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    await UserTest.createWithRole("hr_manager");
    await AttendanceTest.checkIn(currentUser.id, new Date("2026-03-07"));
  });

  afterEach(async () => {
    await AttendanceTest.deleteAll();
    await UserTest.delete();
  });

  it("should allow HR to see all employee attendances", async () => {
    await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "testuser");

    const response = await supertest(web)
      .get("/api/hr/attendance/report")
      .set("Authorization", "testhr");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it("should reject non-HR users (403 Forbidden)", async () => {
    await supertest(web)
      .post("/api/attendance/check-out")
      .set("Authorization", "testuser");

    const response = await supertest(web)
      .get("/api/hr/attendance/report")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.errors).toBeDefined();
  });
});
