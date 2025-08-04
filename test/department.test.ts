import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {Department} from "@prisma/client";
import {DepartmentTest, UserTest} from "./test-util";

describe("POST /api/hr/departments", () => {
  beforeEach(async () => {
    await UserTest.create();
    await DepartmentTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
    await DepartmentTest.delete();
  });

  it("should create a new department and return 201 with department data", async () => {
    const response = await supertest(web)
      .post("/api/hr/departments")
      .send({
        name: "IT",
        description: "Information Technology",
      })
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should return 400 if department with the same name already exists", async () => {
    const response = await supertest(web)
      .post("/api/hr/departments")
      .send({
        name: "HR",
        description: "Human Resource",
      })
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should return 400 if request body is invalid", async () => {
    const response = await supertest(web)
      .post("/api/hr/departments")
      .send({
        name: "",
        description: "",
      })
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/departments/:departmentId", () => {
  let currentDepartment: Department;
  beforeEach(async () => {
    await UserTest.create();
    await DepartmentTest.create();
    currentDepartment = await DepartmentTest.get();
  });
  afterEach(async () => {
    await UserTest.delete();
    await DepartmentTest.delete();
  });

  it("should return 200 and the correct department data", async () => {
    const id = currentDepartment.id;
    const response = await supertest(web)
      .get(`/api/departments/${id}`)
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 400 if the department does not exist", async () => {
    const response = await supertest(web)
      .get("/api/departments/2")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/hr/departments/:departmentId", () => {
  let currentDepartment: Department;
  beforeEach(async () => {
    await UserTest.create();
    await DepartmentTest.create();
    currentDepartment = await DepartmentTest.get();
  });
  afterEach(async () => {
    await UserTest.delete();
    await DepartmentTest.delete();
  });

  it("should return 200 and update the department successfully when given valid data", async () => {
    const id = currentDepartment.id;
    const response = await supertest(web)
      .put(`/api/hr/departments/${id}`)
      .set("Authorization", "test")
      .send({
        name: "HR edit",
        description: "Human Resource edit",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toContain("edit");
    expect(response.body.data.description).toContain("edit");
    expect(response.body.message).toBeDefined();
  });

  it("should return 404 if the department to update does not exist", async () => {
    const response = await supertest(web)
      .put("/api/hr/departments/1")
      .set("Authorization", "test")
      .send({
        name: "HR edit",
        description: "Human Resource edit",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/hr/departments/:deparmentId", () => {
  let currentDepartment: Department;
  beforeEach(async () => {
    await UserTest.create();
    await DepartmentTest.create();
    currentDepartment = await DepartmentTest.get();
  });
  afterEach(async () => {
    await UserTest.delete();
    await DepartmentTest.delete();
  });

  it("should return 200 and remove the department successfully when given a valid ID", async () => {
    const id = currentDepartment.id;
    const response = await supertest(web)
      .delete(`/api/hr/departments/${id}`)
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });

  it("should return 404 if the department to delete does not exist", async () => {
    const response = await supertest(web)
      .delete("/api/hr/departments/1")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/departments", () => {
  beforeEach(async () => {
    await UserTest.create();
    await DepartmentTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
    await DepartmentTest.delete();
  });

  it("should return 200 and the list of departments", async () => {
    const response = await supertest(web)
      .get("/api/departments")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});
