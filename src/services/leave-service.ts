import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  ApproveLeaveRequest,
  CreateLeaveRequest,
  LeaveResponse,
  SearchLeaveRequest,
  toLeaveResponse,
} from "../models/leave-model";
import {LeaveValidation} from "../validations/leave-validation";
import {Validation} from "../validations/validation";
import {Pageable} from "../models/page";
import {EmployeeService} from "../services/employee-service";

export class LeaveService {
  static async create(request: CreateLeaveRequest): Promise<LeaveResponse> {
    const createRequest = Validation.validate(LeaveValidation.CREATE, request);
    const employeeId = await EmployeeService.getEmployeeId(
      createRequest.user_id,
    );

    const start = createRequest.start_date;
    const end = createRequest.end_date;

    if (end < start) {
      throw new ResponseError(
        404,
        "End date cannot be earlier than start date",
      );
    }

    let totalDays = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (totalDays === 0) {
      throw new ResponseError(400, "Leave cannot be taken on weekends only");
    }

    const leave = await prismaClient.leave.create({
      data: {
        employee_id: employeeId,
        start_date: start,
        end_date: end,
        total_days: totalDays,
        type: createRequest.type,
        reason: createRequest.reason,
      },
      include: {
        employee: {
          include: {
            person: true,
            department: true,
          },
        },
      },
    });

    return toLeaveResponse(leave);
  }

  static async search(
    request: SearchLeaveRequest,
  ): Promise<Pageable<LeaveResponse>> {
    const searchRequest = Validation.validate(LeaveValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = {
      ...(searchRequest.user_id && {
        employee_id: await EmployeeService.getEmployeeId(searchRequest.user_id),
      }),
      ...(searchRequest.fullname && {
        employee: {
          person: {
            fullname: {
              contains: searchRequest.fullname,
            },
          },
        },
      }),
      ...(searchRequest.type && {
        type: searchRequest.type,
      }),
      ...(searchRequest.status && {
        status: searchRequest.status,
      }),
    };

    const [result, total] = await Promise.all([
      prismaClient.leave.findMany({
        where: filters,
        include: {
          employee: {
            include: {
              person: true,
              department: true,
            },
          },
        },
        take: searchRequest.size,
        skip: skip,
      }),
      prismaClient.leave.count({
        where: filters,
      }),
    ]);

    return {
      data: result.map(leave => toLeaveResponse(leave)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }

  static async get(id: number): Promise<LeaveResponse> {
    const result = await prismaClient.leave.findFirst({
      where: {id},
      include: {
        employee: {
          include: {
            person: true,
            department: true,
          },
        },
      },
    });

    if (!result) {
      throw new ResponseError(404, "Employee not found.");
    }

    return toLeaveResponse(result);
  }

  static async approve(request: ApproveLeaveRequest): Promise<LeaveResponse> {
    const approveRequest = Validation.validate(
      LeaveValidation.APPROVE,
      request,
    );
    const approverId = await EmployeeService.getEmployeeId(
      approveRequest.user_id,
    );
    const leave = await prismaClient.leave.findUnique({
      where: {
        id: approveRequest.id,
      },
    });

    if (!leave) {
      throw new ResponseError(404, "Leave not found");
    }

    const updatedLeave = await prismaClient.leave.update({
      where: {
        id: leave.id,
      },
      data: {
        status: approveRequest.status,
        rejection_reason:
          approveRequest.status === "rejected"
            ? approveRequest.rejection_reason
            : null,
        approved_by: approverId,
        approved_at: new Date(),
      },
      include: {
        employee: {
          include: {
            person: true,
            department: true,
          },
        },
      },
    });

    if (updatedLeave.status === "approved") {
      const dates = [];
      let currentDate = new Date(updatedLeave.start_date);

      while (currentDate <= updatedLeave.end_date) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await prismaClient.attendance.createMany({
        data: dates.map(date => ({
          employee_id: updatedLeave.employee_id,
          date: date,
          status: "on_leave",
        })),
      });
    }

    return toLeaveResponse(updatedLeave);
  }
}
