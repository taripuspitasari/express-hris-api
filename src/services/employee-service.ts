import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  PromoteEmployeeRequest,
  EmployeeResponse,
  SearchEmployeeRequest,
  toEmployeeResponse,
  UpdateEmployeeRequest,
} from "../models/employee-model";
import {Pageable} from "../models/page";
import {EmployeeValidation} from "../validations/employee-validation";
import {Validation} from "../validations/validation";

export class EmployeeService {
  static async promote(
    request: PromoteEmployeeRequest,
  ): Promise<EmployeeResponse> {
    const promoteRequest = Validation.validate(
      EmployeeValidation.PROMOTE,
      request,
    );

    const employeeExist = await prismaClient.employee.count({
      where: {
        person_id: promoteRequest.person_id,
      },
    });

    if (employeeExist !== 0) {
      throw new ResponseError(400, "This person is already employee.");
    }

    const result = await prismaClient.$transaction(async tx => {
      const lastEmployee = await tx.employee.findFirst({
        orderBy: {id: "desc"},
        select: {employee_number: true},
      });

      let newSequence = 1;
      if (lastEmployee && lastEmployee.employee_number) {
        const lastNumber = parseInt(lastEmployee.employee_number.split("-")[1]);
        if (!isNaN(lastNumber)) {
          newSequence = lastNumber + 1;
        }
      }
      const autoEmployeeNumber = `EMP-${newSequence.toString().padStart(5, "0")}`;

      await tx.user.update({
        where: {
          person_id: promoteRequest.person_id,
        },
        data: {
          roles: {
            create: {
              role: {
                connectOrCreate: {
                  where: {name: "employee"},
                  create: {name: "employee"},
                },
              },
            },
          },
        },
      });

      const newEmployee = await tx.employee.create({
        data: {...promoteRequest, employee_number: autoEmployeeNumber},
        include: {
          person: true,
          department: true,
          position: true,
        },
      });

      return newEmployee;
    });

    return toEmployeeResponse(result);
  }

  static async update(
    request: UpdateEmployeeRequest,
  ): Promise<EmployeeResponse> {
    const updateRequest = Validation.validate(
      EmployeeValidation.UPDATE,
      request,
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
        person: true,
        department: true,
        position: true,
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
        person: true,
        department: true,
        position: true,
      },
    });
    if (!result) {
      throw new ResponseError(404, "Employee not found.");
    }
    return toEmployeeResponse(result);
  }

  static async offboard(id: number) {
    const employee = await prismaClient.employee.findUnique({
      where: {
        id: id,
      },

      include: {
        person: {
          include: {
            user: {
              include: {
                roles: {
                  include: {role: true},
                },
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new ResponseError(404, "Employee not found.");
    }

    await prismaClient.$transaction(async tx => {
      await prismaClient.employee.update({
        where: {
          id: id,
        },
        data: {
          status: "inactive",
          deleted_at: new Date(),
        },
      });

      const user = employee.person.user;
      if (user) {
        const employeeRole = user.roles.find(r => r.role.name === "employee");
        if (employeeRole) {
          await tx.userRole.delete({
            where: {
              user_id_role_id: {
                user_id: user.id,
                role_id: employeeRole.role_id,
              },
            },
          });
        }

        await tx.user.update({
          where: {id: user.id},
          data: {is_active: false},
        });
      }
    });
  }

  static async search(
    request: SearchEmployeeRequest,
  ): Promise<Pageable<EmployeeResponse>> {
    const searchRequest = Validation.validate(
      EmployeeValidation.SEARCH,
      request,
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = {
      deleted_at: null,
      ...(searchRequest.fullname && {
        person: {
          fullname: {
            contains: searchRequest.fullname,
          },
        },
      }),
      ...(searchRequest.department_id && {
        department_id: searchRequest.department_id,
      }),
      ...(searchRequest.employee_number && {
        employee_number: searchRequest.employee_number,
      }),
      ...(searchRequest.status && {
        status: searchRequest.status,
      }),
    };

    const [result, total] = await Promise.all([
      prismaClient.employee.findMany({
        where: filters,
        include: {
          person: true,
          department: true,
          position: true,
        },
        take: searchRequest.size,
        skip: skip,
        orderBy: {id: "desc"},
      }),
      prismaClient.employee.count({
        where: filters,
      }),
    ]);

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
