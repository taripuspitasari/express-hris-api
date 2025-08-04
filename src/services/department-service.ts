import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  CreateDepartmentRequest,
  DepartmentResponse,
  SearchDepartmentRequest,
  toDepartmentResponse,
  UpdateDepartmentRequest,
} from "../models/department-model";
import {Pageable} from "../models/page";
import {DepartmentValidation} from "../validations/department-validation";
import {Validation} from "../validations/validation";

export class DepartmentService {
  static async create(
    request: CreateDepartmentRequest
  ): Promise<DepartmentResponse> {
    const createRequest = Validation.validate(
      DepartmentValidation.CREATE,
      request
    );

    const existingDepartment = await prismaClient.department.findFirst({
      where: {
        name: createRequest.name,
      },
    });

    if (existingDepartment) {
      throw new ResponseError(
        400,
        "A department with this name already exists."
      );
    }

    const result = await prismaClient.department.create({
      data: createRequest,
    });

    return toDepartmentResponse(result);
  }

  static async update(
    request: UpdateDepartmentRequest
  ): Promise<DepartmentResponse> {
    const updateRequest = Validation.validate(
      DepartmentValidation.UPDATE,
      request
    );

    const departmentToUpdate = await prismaClient.department.findFirst({
      where: {
        id: updateRequest.id,
      },
    });

    if (!departmentToUpdate) {
      throw new ResponseError(404, "Department not found.");
    }

    const existingDepartment = await prismaClient.department.findFirst({
      where: {
        name: updateRequest.name,
        NOT: {
          id: updateRequest.id,
        },
      },
    });

    if (existingDepartment) {
      throw new ResponseError(
        400,
        "A department with this name already exists."
      );
    }

    const result = await prismaClient.department.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toDepartmentResponse(result);
  }

  static async remove(id: number): Promise<DepartmentResponse> {
    const departmentToDelete = await prismaClient.department.findFirst({
      where: {
        id: id,
      },
    });

    if (!departmentToDelete) {
      throw new ResponseError(404, "Department not found.");
    }

    const result = await prismaClient.department.delete({
      where: {
        id: id,
      },
    });

    return toDepartmentResponse(result);
  }

  static async get(id: number): Promise<DepartmentResponse> {
    const result = await prismaClient.department.findFirst({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new ResponseError(404, "Department not exist");
    }

    return toDepartmentResponse(result);
  }

  static async search(
    request: SearchDepartmentRequest
  ): Promise<Pageable<DepartmentResponse>> {
    const searchRequest = Validation.validate(
      DepartmentValidation.SEARCH,
      request
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const result = await prismaClient.department.findMany({
      where: {
        name: searchRequest.name,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.department.count({
      where: {
        name: searchRequest.name,
      },
    });

    return {
      data: result.map(department => toDepartmentResponse(department)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
