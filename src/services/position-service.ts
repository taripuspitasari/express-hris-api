import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Pageable} from "../models/page";
import {
  CreatePositionRequest,
  PositionResponse,
  SearchPositionRequest,
  toPositionResponse,
  UpdatePositionRequest,
} from "../models/position-model";
import {PositionValidation} from "../validations/position-validation";
import {Validation} from "../validations/validation";

export class PositionService {
  static async create(
    request: CreatePositionRequest,
  ): Promise<PositionResponse> {
    const createRequest = Validation.validate(
      PositionValidation.CREATE,
      request,
    );

    const department = await prismaClient.department.findUnique({
      where: {
        id: createRequest.department_id,
        deleted_at: null,
      },
    });

    if (!department) {
      throw new ResponseError(404, "Department not found.");
    }

    const existingPosition = await prismaClient.position.findFirst({
      where: {
        name: createRequest.name,
        department_id: createRequest.department_id,
      },
    });

    if (existingPosition) {
      throw new ResponseError(400, "A position with this name already exists.");
    }

    const result = await prismaClient.position.create({
      data: createRequest,
      include: {
        department: true,
      },
    });

    return toPositionResponse(result);
  }

  static async update(
    request: UpdatePositionRequest,
  ): Promise<PositionResponse> {
    const updateRequest = Validation.validate(
      PositionValidation.UPDATE,
      request,
    );

    const positionToUpdate = await prismaClient.position.findFirst({
      where: {
        id: updateRequest.id,
        deleted_at: null,
      },
    });

    if (!positionToUpdate) {
      throw new ResponseError(404, "Position not found or has been deleted.");
    }

    if (updateRequest.name || updateRequest.department_id) {
      const existingPosition = await prismaClient.position.findFirst({
        where: {
          name: updateRequest.name ?? positionToUpdate.name,
          department_id:
            updateRequest.department_id ?? positionToUpdate.department_id,
          deleted_at: null,
          NOT: {
            id: updateRequest.id,
          },
        },
      });

      if (existingPosition) {
        throw new ResponseError(
          400,
          "A position with this name already exists in the department.",
        );
      }
    }

    const result = await prismaClient.position.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
      include: {
        department: true,
      },
    });

    return toPositionResponse(result);
  }

  static async remove(id: number): Promise<PositionResponse> {
    const positionToDelete = await prismaClient.position.findFirst({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!positionToDelete) {
      throw new ResponseError(404, "Position not found or has been deleted.");
    }

    const employeeCount = await prismaClient.employee.count({
      where: {
        position_id: positionToDelete.id,
        status: {
          in: ["active", "on_leave"],
        },
      },
    });

    if (employeeCount > 0) {
      throw new ResponseError(
        404,
        "Cannot delete position that still has active employees.",
      );
    }

    const result = await prismaClient.position.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
      include: {
        department: true,
      },
    });

    return toPositionResponse(result);
  }

  static async get(id: number): Promise<PositionResponse> {
    const result = await prismaClient.position.findFirst({
      where: {
        id: id,
        deleted_at: null,
      },
      include: {
        department: true,
      },
    });

    if (!result) {
      throw new ResponseError(404, "Position not found or has been deleted.");
    }

    return toPositionResponse(result);
  }

  static async search(
    request: SearchPositionRequest,
  ): Promise<Pageable<PositionResponse>> {
    const searchRequest = Validation.validate(
      PositionValidation.SEARCH,
      request,
    );

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = {
      deleted_at: null,
      department: {
        deleted_at: null,
      },
      ...(searchRequest.name && {
        name: {
          contains: searchRequest.name,
        },
      }),
      ...(searchRequest.level && {
        name: searchRequest.level,
      }),
      ...(searchRequest.department_id && {
        department_id: searchRequest.department_id,
      }),
    };

    const [result, total] = await Promise.all([
      prismaClient.position.findMany({
        where: filters,
        take: searchRequest.size,
        skip: skip,
        include: {
          department: true,
        },
      }),
      prismaClient.position.count({
        where: filters,
      }),
    ]);

    // const result = await prismaClient.position.findMany({
    //   where: filters,
    //   take: searchRequest.size,
    //   skip: skip,
    //   include: {
    //     department: true,
    //   },
    // });

    // const total = await prismaClient.position.count({
    //   where: filters,
    // });

    return {
      data: result.map(position => toPositionResponse(position)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
