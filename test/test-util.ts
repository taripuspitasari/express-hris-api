import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {User, Job, Application} from "@prisma/client";

export class UserTest {
  static userId: string | null = null;

  static async delete() {
    if (this.userId) {
      await prismaClient.user.deleteMany({
        where: {
          id: this.userId,
        },
      });
      this.userId = null;
    } else {
      await prismaClient.user.deleteMany({
        where: {
          email: "test@gmail.com",
        },
      });
    }
  }

  static async create() {
    const user = await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@gmail.com",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });

    this.userId = user.id;
  }

  static async get(): Promise<User> {
    if (!this.userId) {
      throw new Error("User ID is not set.");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: this.userId,
      },
    });

    if (!user) {
      throw new Error("User is not found.");
    }

    return user;
  }
}

export class JobTest {
  static jobId: number | null = null;
  static async deleteAll() {
    if (!UserTest.userId) {
      throw new Error("User ID is not set.");
    }

    await prismaClient.job.deleteMany({
      where: {
        user_id: UserTest.userId,
      },
    });
  }

  static async create() {
    if (!UserTest.userId) {
      throw new Error("User ID is not set or is null.");
    }

    const job = await prismaClient.job.create({
      data: {
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
        user_id: UserTest.userId,
      },
    });

    this.jobId = job.id;
  }

  static async get(): Promise<Job> {
    if (!UserTest.userId) {
      throw new Error("User ID is not set or is null.");
    }

    const job = await prismaClient.job.findFirst({
      where: {
        user_id: UserTest.userId,
      },
    });

    if (!job) {
      throw new Error("Job is not found");
    }

    return job;
  }
}

export class ApplicationTest {
  static applicationId: number | null = null;

  static async deleteAll() {
    if (!UserTest.userId) {
      throw new Error("User ID is not set.");
    }

    if (!JobTest.jobId) {
      throw new Error("Job ID is not set.");
    }

    await prismaClient.application.deleteMany({
      where: {
        user_id: UserTest.userId,
        job_id: JobTest.jobId,
      },
    });
  }

  static async create() {
    if (!UserTest.userId) {
      throw new Error("User ID is not set.");
    }

    if (!JobTest.jobId) {
      throw new Error("Job ID is not set.");
    }

    const application = await prismaClient.application.create({
      data: {
        resume: "se123.pdf",
        job_id: JobTest.jobId,
        user_id: UserTest.userId,
      },
    });

    this.applicationId = application.id;
  }

  static async get(): Promise<Application> {
    if (!UserTest.userId) {
      throw new Error("User ID is not set.");
    }

    if (!JobTest.jobId) {
      throw new Error("Job ID is not set.");
    }

    const application = await prismaClient.application.findFirst({
      where: {
        user_id: UserTest.userId,
        job_id: JobTest.jobId,
      },
    });

    if (!application) {
      throw new Error("Application is not found");
    }

    return application;
  }
}
