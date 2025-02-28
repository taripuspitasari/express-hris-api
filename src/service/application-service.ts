import {User} from "@prisma/client";
import {
  ApplicationResponse,
  CreateApplicationRequest,
  toApplicationResponse,
  UpdateApplicationRequest,
} from "../model/application-model";
import {ApplicationValidation} from "../validation/application-validation";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class ApplicationService {
  static async create(
    user: User,
    request: CreateApplicationRequest
  ): Promise<ApplicationResponse> {
    const createRequest = Validation.validate(
      ApplicationValidation.CREATE,
      request
    );

    const existingApplication = await prismaClient.application.findFirst({
      where: {
        user_id: user.id,
        job_id: request.job_id,
      },
    });

    if (existingApplication) {
      throw new ResponseError(400, "You have already applied");
    }

    const application = await prismaClient.application.create({
      data: {...createRequest, user_id: user.id},
    });

    return toApplicationResponse(application);
  }

  static async get(user: User, id: number): Promise<ApplicationResponse> {
    const application = await prismaClient.application.findFirst({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    if (!application) {
      throw new ResponseError(401, "application is not found!");
    }

    return toApplicationResponse(application);
  }

  static async update(
    user: User,
    request: UpdateApplicationRequest
  ): Promise<ApplicationResponse> {
    const updateRequest = Validation.validate(
      ApplicationValidation.UPDATE,
      request
    );

    const applicationExist = await prismaClient.application.findFirst({
      where: {
        id: updateRequest.id,
      },
    });

    if (!applicationExist) {
      throw new ResponseError(400, "Application is not found.");
    }

    const application = await prismaClient.application.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toApplicationResponse(application);
  }

  static async remove(user: User, id: number): Promise<ApplicationResponse> {
    const applicationExist = await prismaClient.application.findFirst({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    if (!applicationExist) {
      throw new ResponseError(401, "application is not found!");
    }

    const application = await prismaClient.application.delete({
      where: {
        id: id,
      },
    });

    return toApplicationResponse(application);
  }

  static async listForUser(user: User): Promise<Array<ApplicationResponse>> {
    const applications = await prismaClient.application.findMany({
      where: {
        user_id: user.id,
      },
    });

    return applications.map(application => toApplicationResponse(application));
  }

  static async listForHR(): Promise<Array<ApplicationResponse>> {
    const applications = await prismaClient.application.findMany();

    return applications.map(application => toApplicationResponse(application));
  }
}
