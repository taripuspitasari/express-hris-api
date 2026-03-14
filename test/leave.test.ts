import supertest from "supertest";
import {web} from "../src/application/web";
import {UserTest} from "./test-utils/user";
import {logger} from "../src/application/logging";
import {Leave, User} from "@prisma/client";
import {LeaveTest} from "./test-utils/leave";

describe("POST /api/leaves", () => {
  beforeEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithEmployee();
  });

  afterEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
  });

  it("should success request leave", async () => {
    const response = await supertest(web)
      .post("/api/leaves")
      .send({
        type: "annual_leave",
        start_date: "2026-03-20",
        end_date: "2026-03-22",
        reason: "Family vacation",
      })
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should fail if unauthorized", async () => {
    const response = await supertest(web)
      .post("/api/leaves")
      .send({
        type: "annual_leave",
        start_date: "2026-03-20",
        end_date: "2026-03-22",
        reason: "Family vacation",
      })
      .set("Authorization", "wrong");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/leaves/:leaveId", () => {
  let currentUser: User;
  let currentLeave: Leave;
  beforeEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    currentLeave = await LeaveTest.create(currentUser.id);
  });

  afterEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
  });

  it("should return requested leave", async () => {
    const response = await supertest(web)
      .get(`/api/leaves/${currentLeave.id}`)
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 if leave does not exist", async () => {
    const response = await supertest(web)
      .get("/api/leaves/1")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("UPDATE /api/leaves/:leaveId/status", () => {
  let currentUser: User;
  let currentLeave: Leave;
  beforeEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
    await UserTest.createRoleWithEmployee("hr_manager");
    currentUser = await UserTest.createWithEmployee();
    currentLeave = await LeaveTest.create(currentUser.id);
  });

  afterEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
  });

  it("should approve requested leave", async () => {
    const response = await supertest(web)
      .put(`/api/leaves/${currentLeave.id}/status`)
      .set("Authorization", "testhr")
      .send({
        status: "rejected",
        rejection_reason: "Tanggal tersebut sedang ada deadline project",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 if unathorize", async () => {
    const response = await supertest(web)
      .put(`/api/leaves/${currentLeave.id}/status`)
      .set("Authorization", "testuser")
      .send({
        status: "rejected",
        rejection_reason: "Tanggal tersebut sedang ada deadline project",
      });

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/leaves/history", () => {
  let currentUser: User;

  beforeEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    await LeaveTest.create(currentUser.id);
  });

  afterEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
  });

  it("should return requested leave", async () => {
    const response = await supertest(web)
      .get("/api/leaves/history")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

describe("GET /api/leaves/report", () => {
  let currentUser: User;

  beforeEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
    currentUser = await UserTest.createWithEmployee();
    await UserTest.createWithRole("hr_manager");
    await LeaveTest.create(currentUser.id);
  });

  afterEach(async () => {
    await LeaveTest.deleteAll();
    await UserTest.delete();
  });

  it("should allow HR to see all employee leaves", async () => {
    const response = await supertest(web)
      .get("/api/leaves/report")
      .set("Authorization", "testhr");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it("should reject non-HR users (403 Forbidden)", async () => {
    const response = await supertest(web)
      .get("/api/leaves/report")
      .set("Authorization", "testuser");

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.errors).toBeDefined();
  });
});
