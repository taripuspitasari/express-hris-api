import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  CreateEmployeeRequest,
  EmployeeResponse,
  SearchEmployeeRequest,
  toEmployeeResponse,
  UpdateEmployeeRequest,
} from "../models/employee-model";
import {Pageable} from "../models/page";
import {EmployeeValidation} from "../validations/employee-validation";
import {Validation} from "../validations/validation";

export class EmployeeService {
  static async create(
    request: CreateEmployeeRequest
  ): Promise<EmployeeResponse> {
    const createRequest = Validation.validate(
      EmployeeValidation.CREATE,
      request
    );

    const existingEmployee = await prismaClient.employee.findFirst({
      where: {
        user_id: createRequest.user_id,
      },
    });

    if (existingEmployee) {
      throw new ResponseError(400, "User is already employee.");
    }

    // const result = await prismaClient.employee.create({
    //   data: createRequest,
    //   include: {
    //     user: true,
    //     department: true,
    //   },
    // });

    // await prismaClient.user.update({
    //   where: {
    //     id: result.user_id,
    //   },
    //   data: {
    //     role: "employee",
    //   },
    // });

    const [result] = await prismaClient.$transaction([
      prismaClient.employee.create({
        data: createRequest,
        include: {
          user: true,
          department: true,
        },
      }),
      prismaClient.user.update({
        where: {
          id: createRequest.user_id,
        },
        data: {
          role: "employee",
        },
      }),
    ]);
    return toEmployeeResponse(result);
  }

  static async update(
    request: UpdateEmployeeRequest
  ): Promise<EmployeeResponse> {
    const updateRequest = Validation.validate(
      EmployeeValidation.UPDATE,
      request
    );

    const employeeToUpdate = await prismaClient.employee.findFirst({
      where: {
        id: updateRequest.id,
      },
    });

    if (!employeeToUpdate) {
      throw new ResponseError(404, "Employee not found.");
    }

    const result = await prismaClient.employee.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
      include: {
        user: true,
        department: true,
      },
    });

    return toEmployeeResponse(result);
  }

  static async get(id: number): Promise<EmployeeResponse> {
    const result = await prismaClient.employee.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
        department: true,
      },
    });

    if (!result) {
      throw new ResponseError(404, "Employee not found.");
    }

    return toEmployeeResponse(result);
  }

  static async search(
    request: SearchEmployeeRequest
  ): Promise<Pageable<EmployeeResponse>> {
    const searchRequest = Validation.validate(
      EmployeeValidation.SEARCH,
      request
    );

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters: any[] = [];

    if (searchRequest.name) {
      filters.push({
        user: {
          name: {
            contains: searchRequest.name,
          },
        },
      });
    }

    if (searchRequest.status) {
      filters.push({
        status: searchRequest.status,
      });
    }

    if (searchRequest.department_id) {
      filters.push({
        department_id: searchRequest.department_id,
      });
    }

    const result = await prismaClient.employee.findMany({
      where: {
        AND: filters,
      },
      include: {
        user: true,
        department: true,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.employee.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: result.map(employee => toEmployeeResponse(employee)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
