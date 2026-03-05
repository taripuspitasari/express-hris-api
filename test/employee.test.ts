import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-utils/user";
import {PositionTest} from "./test-utils/position";
import {EmployeeTest} from "./test-utils/employee";
import {Employee, Position, User} from "@prisma/client";

describe("POST /api/employees/promote", () => {
  let currentPosition: Position;
  let currentUser: User;
  beforeEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
    currentUser = await UserTest.create();
  });

  afterEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
  });

  it("should create a new employee return 201 with valid data", async () => {
    const response = await supertest(web)
      .post("/api/employees/promote")
      .send({
        person_id: currentUser.person_id,
        position_id: currentPosition.id,
        department_id: currentPosition.department_id,
        join_date: "2026-03-05",
        status: "active",
      })
      .set("Authorization", "testhr");

    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should return 400 if person already employee", async () => {
    await supertest(web)
      .post("/api/employees/promote")
      .send({
        person_id: currentUser.person_id,
        position_id: currentPosition.id,
        department_id: currentPosition.department_id,
        join_date: new Date().toISOString(),
        status: "active",
      })
      .set("Authorization", "testhr");

    const response = await supertest(web)
      .post("/api/employees/promote")
      .send({
        person_id: currentUser.person_id,
        position_id: currentPosition.id,
        department_id: currentPosition.department_id,
        join_date: new Date().toISOString(),
        status: "active",
      })
      .set("Authorization", "testhr");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBe("This person is already employee.");
  });

  it("should return 400 if data is invalid", async () => {
    const response = await supertest(web)
      .post("/api/employees/promote")
      .send({
        person_id: 99,
        position_id: 12,
        department_id: "",
        join_date: new Date().toISOString(),
        status: "active",
      })
      .set("Authorization", "testhr");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/employees/:employeeId", () => {
  let currentPosition: Position;
  let currentUser: User;
  let currentEmployee: Employee;

  beforeEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
    currentUser = await UserTest.create();
    currentEmployee = await EmployeeTest.create(
      currentUser.person_id,
      currentPosition.department_id,
      currentPosition.id,
    );
  });

  afterEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and correct data", async () => {
    const response = await supertest(web)
      .get(`/api/employees/${currentEmployee.id}`)
      .set("Authorization", "testhr");

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 if the employee does not exist", async () => {
    const response = await supertest(web)
      .get("/api/employees/1")
      .set("Authorization", "testhr");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBe("Employee not found.");
  });
});

describe("PUT /api/employees/:employeeId", () => {
  let currentPosition: Position;
  let currentUser: User;
  let currentEmployee: Employee;

  beforeEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
    currentUser = await UserTest.create();
    currentEmployee = await EmployeeTest.create(
      currentUser.person_id,
      currentPosition.department_id,
      currentPosition.id,
    );
  });

  afterEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and correct data", async () => {
    const response = await supertest(web)
      .put(`/api/employees/${currentEmployee.id}`)
      .set("Authorization", "testhr")
      .send({
        status: "on_leave",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Employee updated successfully.");
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 if the employee does not exist", async () => {
    const response = await supertest(web)
      .put("/api/employees/1")
      .set("Authorization", "testhr")
      .send({
        status: "on_leave",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBe("Employee not found.");
  });
});

describe("DELETE /api/employees/:employeeId/offboard", () => {
  let currentPosition: Position;
  let currentUser: User;
  let currentEmployee: Employee;

  beforeEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
    currentUser = await UserTest.create();
    currentEmployee = await EmployeeTest.create(
      currentUser.person_id,
      currentPosition.department_id,
      currentPosition.id,
    );
  });

  afterEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and offboard employee successfully", async () => {
    const response = await supertest(web)
      .delete(`/api/employees/${currentEmployee.id}/offboard`)
      .set("Authorization", "testhr");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Employee offboarded and access revoked successfully.",
    );
  });

  it("should return 404 if employee does not exist", async () => {
    const response = await supertest(web)
      .delete("/api/employees/1/offboard")
      .set("Authorization", "testhr");

    expect(response.status).toBe(404);
    expect(response.body.errors).toBe("Employee not found.");
  });
});

describe("GET /api/employees", () => {
  let currentPosition: Position;
  let currentUser: User;
  beforeEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentPosition = await PositionTest.create();
    currentUser = await UserTest.create();
  });

  afterEach(async () => {
    await EmployeeTest.delete();
    await UserTest.delete();
  });

  it("should return 200 and list of employees", async () => {
    await EmployeeTest.create(
      currentUser.person_id,
      currentPosition.department_id,
      currentPosition.id,
    );

    const response = await supertest(web)
      .get("/api/employees")
      .set("Authorization", "testhr");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBeDefined();
    expect(response.body.paging.total_page).toBeDefined();
    expect(response.body.paging.size).toBeDefined();
  });
});
