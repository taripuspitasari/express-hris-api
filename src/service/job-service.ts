import {Job, User} from "@prisma/client";
import {
  CreateJobRequest,
  JobResponse,
  SearchJobRequest,
  toJobResponse,
  UpdateJobRequest,
} from "../model/job-model";
import {JobValidation} from "../validation/job-validation";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Pageable} from "../model/page";

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

  static async search(
    request: SearchJobRequest
  ): Promise<Pageable<JobResponse>> {
    const searchRequest = Validation.validate(JobValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters: any = {};
    if (searchRequest.title) {
      filters.title = {contains: searchRequest.title};
    }

    if (searchRequest.job_type) {
      filters.job_type = {equals: searchRequest.job_type};
    }

    if (searchRequest.workplace_type) {
      filters.workplace_type = {equals: searchRequest.workplace_type};
    }

    if (searchRequest.experience_level) {
      filters.experience_level = {equals: searchRequest.experience_level};
    }

    if (searchRequest.location) {
      filters.location = {contains: searchRequest.location};
    }

    console.log("Filters:", filters);

    const jobs = await prismaClient.job.findMany({
      where: filters,
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.job.count({
      where: filters,
    });

    return {
      data: jobs.map(job => toJobResponse(job)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
