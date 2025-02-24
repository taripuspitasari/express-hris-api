import supertest from "supertest";
import {UserTest, JobTest} from "./test-util";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe("POST /api/jobs", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should create new job", async () => {
    const response = await supertest(web)
      .post("/api/jobs")
      .set("X-API-TOKEN", "test")
      .send({
        title: "Software Engineer",
        description:
          "Responsible for developing web applications using JavaScript and TypeScript.",
        status: "OPEN",
        job_type: "FULL_TIME",
        workplace_type: "REMOTE",
        experience_level: "JUNIOR",
        location: "Jakarta, Indonesia",
        salary_range: "Rp10.000.000 - Rp15.000.000",
        expiry_date: "2025-03-15T23:59:59.999Z",
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe("Software Engineer");
    expect(response.body.data.description).toBe(
      "Responsible for developing web applications using JavaScript and TypeScript."
    );
    expect(response.body.data.status).toBe("OPEN");
    expect(response.body.data.job_type).toBe("FULL_TIME");
    expect(response.body.data.workplace_type).toBe("REMOTE");
    expect(response.body.data.experience_level).toBe("JUNIOR");
    expect(response.body.data.location).toBe("Jakarta, Indonesia");
    expect(response.body.data.salary_range).toBe("Rp10.000.000 - Rp15.000.000");
    expect(response.body.data.expiry_date).toBe("2025-03-15T23:59:59.999Z");
    expect(response.body.data.user_id).toBeDefined();
    expect(response.body.data.applications_count).toBe(0);
  });

  it("should reject new job if data is invalid", async () => {
    const response = await supertest(web)
      .post("/api/jobs")
      .set("X-API-TOKEN", "test")
      .send({
        title: "",
        description: "",
        status: "",
        job_type: "",
        workplace_type: "",
        experience_level: "",
        location: "",
        salary_range: "",
        expiry_date: "",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
