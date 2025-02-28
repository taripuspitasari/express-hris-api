import supertest from "supertest";
import {UserTest, JobTest, ApplicationTest} from "./test-util";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe("POST /api/jobs", () => {
  beforeEach(async () => {
    await UserTest.create();
    await JobTest.create();
  });

  afterEach(async () => {
    await ApplicationTest.deleteAll();
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should create new application", async () => {
    const response = await supertest(web)
      .post("/api/applications")
      .set("X-API-TOKEN", "test")
      .send({
        resume: "se123.pdf",
        job_id: JobTest.jobId,
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.job_id).toBeDefined();
    expect(response.body.data.user_id).toBeDefined();
    expect(response.body.data.resume).toBe("se123.pdf");
    expect(response.body.data.created_at).toBeDefined();
    expect(response.body.message).toBe("Application successfully created");
  });

  it("should reject new application if data is invalid", async () => {
    const response = await supertest(web)
      .post("/api/applications")
      .set("X-API-TOKEN", "test")
      .send({
        resume: "",
        job_id: JobTest.jobId,
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject new application if token is missing", async () => {
    const response = await supertest(web)
      .post("/api/applications")
      .set("X-API-TOKEN", "")
      .send({
        resume: "se123.pdf",
        job_id: JobTest.jobId,
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
