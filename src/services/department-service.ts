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
    request: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const createRequest = Validation.validate(
      DepartmentValidation.CREATE,
      request,
    );

    const existingDepartment = await prismaClient.department.findUnique({
      where: {
        name: createRequest.name,
      },
    });

    if (existingDepartment) {
      throw new ResponseError(
        400,
        "A department with this name already exists.",
      );
    }

    const result = await prismaClient.department.create({
      data: createRequest,
    });

    return toDepartmentResponse(result);
  }

  static async update(
    request: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const updateRequest = Validation.validate(
      DepartmentValidation.UPDATE,
      request,
    );

    const departmentToUpdate = await prismaClient.department.findUnique({
      where: {
        id: updateRequest.id,
        deleted_at: null,
      },
    });

    if (!departmentToUpdate) {
      throw new ResponseError(404, "Department not found or has been deleted.");
    }

    if (updateRequest.name) {
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
          "A department with this name already exists.",
        );
      }
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
        deleted_at: null,
      },
    });

    if (!departmentToDelete) {
      throw new ResponseError(404, "Department not found or has been deleted.");
    }

    const result = await prismaClient.department.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return toDepartmentResponse(result);
  }

  static async get(id: number): Promise<DepartmentResponse> {
    const result = await prismaClient.department.findFirst({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!result) {
      throw new ResponseError(404, "Department not found or has been deleted.");
    }

    return toDepartmentResponse(result);
  }

  static async search(
    request: SearchDepartmentRequest,
  ): Promise<Pageable<DepartmentResponse>> {
    const searchRequest = Validation.validate(
      DepartmentValidation.SEARCH,
      request,
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = {
      deleted_at: null,
      ...(searchRequest.name && {
        name: {
          contains: searchRequest.name,
          mode: "insensitive",
        },
      }),
    };

    const result = await prismaClient.department.findMany({
      where: filters,
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.department.count({
      where: filters,
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
