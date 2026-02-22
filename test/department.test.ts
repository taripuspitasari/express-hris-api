import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {Department} from "@prisma/client";
import {DepartmentTest} from "./test-utils/department";
import {UserTest} from "./test-utils/user";

describe("POST /api/departments", () => {
  beforeEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
  });

  afterEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
  });

  it("should create a new department and return 201 with department data", async () => {
    const response = await supertest(web)
      .post("/api/departments")
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
    await supertest(web)
      .post("/api/departments")
      .send({
        name: "IT",
        description: "Information Technology",
      })
      .set("Authorization", "test");

    const response = await supertest(web)
      .post("/api/departments")
      .send({
        name: "IT",
        description: "Information Technology",
      })
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBe(
      "A department with this name already exists.",
    );
    expect(response.body.errors).toBeDefined();
  });

  it("should return 400 if request body is invalid", async () => {
    const response = await supertest(web)
      .post("/api/departments")
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
    await DepartmentTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentDepartment = await DepartmentTest.create();
  });

  afterEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
  });

  it("should return 200 and the correct department data", async () => {
    const response = await supertest(web)
      .get(`/api/departments/${currentDepartment.id}`)
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 if the department does not exist", async () => {
    const response = await supertest(web)
      .get("/api/departments/999")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBe(
      "Department not found or has been deleted.",
    );
  });
});

describe("PUT /api/departments/:departmentId", () => {
  let currentDepartment: Department;

  beforeEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentDepartment = await DepartmentTest.create();
  });

  afterEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
  });

  it("should return 200 and update the department successfully when given valid data", async () => {
    const response = await supertest(web)
      .put(`/api/departments/${currentDepartment.id}`)
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
      .put("/api/departments/999")
      .set("Authorization", "test")
      .send({
        name: "HR edit",
        description: "Human Resource edit",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBe(
      "Department not found or has been deleted.",
    );
  });

  it("should return 400 if the department name to update already exist", async () => {
    await supertest(web)
      .post("/api/departments")
      .send({
        name: "IT",
        description: "Information Technology",
      })
      .set("Authorization", "test");

    const response = await supertest(web)
      .put(`/api/departments/${currentDepartment.id}`)
      .set("Authorization", "test")
      .send({
        name: "IT",
        description: "Information Technology",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBe(
      "A department with this name already exists.",
    );
  });
});

describe("DELETE /api/departments/:deparmentId", () => {
  let currentDepartment: Department;

  beforeEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
    currentDepartment = await DepartmentTest.create();
  });

  afterEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
  });

  it("should return 200 and remove the department successfully when given a valid ID", async () => {
    const id = currentDepartment.id;
    const response = await supertest(web)
      .delete(`/api/departments/${id}`)
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Department deleted successfully.");
  });

  it("should return 404 if the department to delete does not exist", async () => {
    const response = await supertest(web)
      .delete("/api/departments/999")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBe(
      "Department not found or has been deleted.",
    );
  });
});

describe("GET /api/departments", () => {
  beforeEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
    await UserTest.createWithRole("hr_manager");
  });

  afterEach(async () => {
    await DepartmentTest.deleteAll();
    await UserTest.delete();
  });

  it("should return 200 and the list of departments", async () => {
    await DepartmentTest.create();

    const response = await supertest(web)
      .get("/api/departments")
      .set("Authorization", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBeDefined();
    expect(response.body.paging.total_page).toBeDefined();
    expect(response.body.paging.size).toBeDefined();
  });
});
