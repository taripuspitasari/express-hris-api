import {Job, User} from "@prisma/client";
import {
  CreateJobRequest,
  JobResponse,
  toJobResponse,
  UpdateJobRequest,
} from "../model/job-model";
import {JobValidation} from "../validation/job-validation";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class JobService {
  static async create(
    user: User,
    request: CreateJobRequest
  ): Promise<JobResponse> {
    const createRequest = Validation.validate(JobValidation.CREATE, request);
    const job = await prismaClient.job.create({
      data: {...createRequest, user_id: user.id},
    });

    return toJobResponse(job);
  }

  static async get(id: number): Promise<JobResponse> {
    const job = await prismaClient.job.findUnique({
      where: {
        id: id,
      },
    });
    if (!job) {
      throw new ResponseError(404, "Job is not found!");
    }

    return toJobResponse(job);
  }

  static async checkJobExist(user_id: string, job_id: number): Promise<Job> {
    const job = await prismaClient.job.findFirst({
      where: {
        id: job_id,
        user_id: user_id,
      },
    });

    if (!job) {
      throw new ResponseError(404, "Job is not found!");
    }

    return job;
  }

  static async update(
    user: User,
    request: UpdateJobRequest
  ): Promise<JobResponse> {
    const updateRequest = Validation.validate(JobValidation.UPDATE, request);
    // const jobExist = await prismaClient.job.findUnique({
    //   where: {
    //     id: updateRequest.id,
    //     user_id: user.id,
    //   },
    // });
    // if (!jobExist) {
    //   throw new ResponseError(404, "Job is not found!");
    // }
    await this.checkJobExist(user.id, updateRequest.id);

    const job = await prismaClient.job.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toJobResponse(job);
  }

  static async remove(user: User, id: number): Promise<JobResponse> {
    await this.checkJobExist(user.id, id);

    const job = await prismaClient.job.delete({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    return toJobResponse(job);
  }
}
