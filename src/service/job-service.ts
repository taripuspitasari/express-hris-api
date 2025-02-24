import {User} from "@prisma/client";
import {CreateJobRequest, JobResponse, toJobResponse} from "../model/job-model";
import {JobValidation} from "../validation/job-validation";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";

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
}
