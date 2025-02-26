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

describe("GET /api/jobs/:jobId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await JobTest.create();
  });

  afterEach(async () => {
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able get job", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .get(`/api/jobs/${job.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
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

  it("should not be able get job if job is not found", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .get(`/api/jobs/${job.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/jobs/:jobId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await JobTest.create();
  });

  afterEach(async () => {
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to update job", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .put(`/api/jobs/${job.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        title: "Frontend Developer",
        description:
          "Develop and maintain user-facing features using React and Next.js.",
        status: "CLOSED",
        job_type: "PART_TIME",
        workplace_type: "ONSITE",
        experience_level: "MID",
        location: "Bandung, Indonesia",
        salary_range: "Rp7.000.000 - Rp10.000.000",
        expiry_date: "2025-04-01T23:59:59.999Z",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe("Frontend Developer");
    expect(response.body.data.description).toBe(
      "Develop and maintain user-facing features using React and Next.js."
    );
    expect(response.body.data.status).toBe("CLOSED");
    expect(response.body.data.job_type).toBe("PART_TIME");
    expect(response.body.data.workplace_type).toBe("ONSITE");
    expect(response.body.data.experience_level).toBe("MID");
    expect(response.body.data.location).toBe("Bandung, Indonesia");
    expect(response.body.data.salary_range).toBe("Rp7.000.000 - Rp10.000.000");
    expect(response.body.data.expiry_date).toBe("2025-04-01T23:59:59.999Z");
    expect(response.body.data.user_id).toBeDefined();
    expect(response.body.data.applications_count).toBe(0);
  });

  it("should reject update job if request is invalid ", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .put(`/api/jobs/${job.id}`)
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

  it("should reject update job if token is invalid", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .put(`/api/jobs/${job.id}`)
      .set("X-API-TOKEN", "")
      .send({
        title: "Frontend Developer",
        description:
          "Develop and maintain user-facing features using React and Next.js.",
        status: "CLOSED",
        job_type: "PART_TIME",
        workplace_type: "ONSITE",
        experience_level: "MID",
        location: "Bandung, Indonesia",
        salary_range: "Rp7.000.000 - Rp10.000.000",
        expiry_date: "2025-04-01T23:59:59.999Z",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/jobs/:jobId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await JobTest.create();
  });

  afterEach(async () => {
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to remove job", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .delete(`/api/jobs/${job.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Job successfully deleted.");
  });

  it("should reject remove job if job is not found", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .delete(`/api/jobs/${job.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject remove job if token is invalid", async () => {
    const job = await JobTest.get();
    const response = await supertest(web)
      .delete(`/api/jobs/${job.id}`)
      .set("X-API-TOKEN", "");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/jobs", () => {
  beforeEach(async () => {
    await UserTest.create();
    await JobTest.create();
  });

  afterEach(async () => {
    await JobTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to search jobs", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job using title", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        title: "Software",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job using location", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        location: "Jakarta",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job using job type", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        job_type: "FULL_TIME",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job using workplace type", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        workplace_type: "REMOTE",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job using experience level", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        experience_level: "JUNIOR",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job no result", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        title: "salah",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(0);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search job with paging", async () => {
    const response = await supertest(web)
      .get("/api/jobs")
      .query({
        page: 2,
        size: 1,
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(2);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(1);
  });
});
