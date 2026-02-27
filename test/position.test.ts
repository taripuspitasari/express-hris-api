import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {PositionTest} from "./test-utils/position";
import {UserTest} from "./test-utils/user";
import {DepartmentTest} from "./test-utils/department";
import {Department, Position} from "@prisma/client";

describe("POST /api/positions", () => {
  let currentDepartment: Department;
  beforeEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentDepartment = await DepartmentTest.create();
  });

  afterEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
  });

  it("should create a new position and return 201", async () => {
    const response = await supertest(web)
      .post("/api/positions")
      .send({
        name: "HR Staff",
        level: "Staff",
        department_id: currentDepartment.id,
      })
      .set("Authorization", "test");

    expect(response.status).toBe(201);
    expect(response.body.data.name).toContain("HR Staff");
    expect(response.body.data.level).toContain("Staff");
    expect(response.body.message).toBe("Position created successfully.");
  });

  it("should return 400 if position with the same name already exists", async () => {
    await supertest(web)
      .post("/api/positions")
      .send({
        name: "HR Staff",
        level: "Staff",
        department_id: currentDepartment.id,
      })
      .set("Authorization", "test");

    const response = await supertest(web)
      .post("/api/positions")
      .send({
        name: "HR Staff",
        level: "Staff",
        department_id: currentDepartment.id,
      })
      .set("Authorization", "test");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBe(
      "A position with this name already exists.",
    );
  });

  it("should return 400 if request body is invalid", async () => {
    const response = await supertest(web)
      .post("/api/positions")
      .send({
        name: "",
        level: "",
        department_id: currentDepartment.id,
      })
      .set("Authorization", "test");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/positions/:positionId", () => {
  let currentPosition: Position;
  beforeEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
  });

  afterEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
  });

  it("should return correct position data", async () => {
    const response = await supertest(web)
      .get(`/api/positions/${currentPosition.id}`)
      .set("Authorization", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("HR Staff");
    expect(response.body.data.level).toBe("Staff");
  });

  it("should return 404 if the position data does not exist", async () => {
    const response = await supertest(web)
      .get("/api/positions/1")
      .set("Authorization", "test");

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/positions/:positionId", () => {
  let currentPosition: Position;

  beforeEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
  });

  afterEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and update the position when given valid data", async () => {
    const response = await supertest(web)
      .put(`/api/positions/${currentPosition.id}`)
      .send({
        name: "HR Staff edit",
        level: "Staff edit",
      })
      .set("Authorization", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("HR Staff edit");
    expect(response.body.data.level).toBe("Staff edit");
  });

  it("should return 400 if the position name already exist", async () => {
    await supertest(web)
      .post("/api/positions")
      .send({
        name: "IT Staff",
        level: "Staff",
        department_id: currentPosition.department_id,
      })
      .set("Authorization", "test");

    const response = await supertest(web)
      .put(`/api/positions/${currentPosition.id}`)
      .send({
        name: "IT Staff",
        level: "Staff",
      })
      .set("Authorization", "test");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/positions/:positionId", () => {
  let currentPosition: Position;

  beforeEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
  });

  afterEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and remove position successfully", async () => {
    const response = await supertest(web)
      .delete(`/api/positions/${currentPosition.id}`)
      .set("Authorization", "test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Position deleted successfully.");
  });

  it("should return 404 if the position to delete does not exist", async () => {
    const response = await supertest(web)
      .delete("/api/positions/1")
      .set("Authorization", "test");

    expect(response.status).toBe(404);
    expect(response.body.errors).toBe(
      "Position not found or has been deleted.",
    );
  });
});

describe("GET /api/positions", () => {
  beforeEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
  });

  afterEach(async () => {
    await PositionTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and the list of positions", async () => {
    await PositionTest.create();

    const response = await supertest(web)
      .get("/api/positions")
      .set("Authorization", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBeDefined();
    expect(response.body.paging.total_page).toBeDefined();
    expect(response.body.paging.size).toBeDefined();
  });
});
