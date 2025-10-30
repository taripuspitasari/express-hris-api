import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  CreateLeaveRequest,
  LeaveResponse,
  SearchLeaveRequest,
  toLeaveResponse,
} from "../models/leave-model";
import {LeaveValidation} from "../validations/leave-validation";
import {Validation} from "../validations/validation";
import {Pageable} from "../models/page";

export class LeaveService {
  private static async getEmployeeId(userId: number): Promise<number> {
    const employee = await prismaClient.employee.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!employee) {
      throw new ResponseError(
        404,
        "The user is not registered as an employee."
      );
    }

    return employee.id;
  }

  private static parseDateToUTC(dateString: string) {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  static async create(request: CreateLeaveRequest): Promise<LeaveResponse> {
    const createRequest = Validation.validate(LeaveValidation.CREATE, request);
    const employeeId = await this.getEmployeeId(createRequest.user_id);
    const start = this.parseDateToUTC(createRequest.start_date);
    const end = this.parseDateToUTC(createRequest.end_date);

    if (end < start) {
      throw new ResponseError(404, "Berapa hari bro?");
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / msPerDay) + 1;

    const leave = await prismaClient.leave.create({
      data: {
        employee_id: employeeId,
        start_date: start,
        end_date: end,
        total_days: totalDays,
        type: createRequest.type,
      },
    });

    return toLeaveResponse(leave);
  }

  static async search(
    request: SearchLeaveRequest
  ): Promise<Pageable<LeaveResponse>> {
    const searchRequest = Validation.validate(LeaveValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters: any[] = [];

    if (searchRequest.status) {
      filters.push({
        status: searchRequest.status,
      });
    }

    if (searchRequest.type) {
      filters.push({
        type: searchRequest.type,
      });
    }

    const leaves = await prismaClient.leave.findMany({
      where: {
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.leave.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: leaves.map(leave => toLeaveResponse(leave)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
