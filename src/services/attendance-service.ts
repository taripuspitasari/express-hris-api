import {User} from "@prisma/client";
import {
  AttendanceResponse,
  SearchAttendanceRequest,
  toAttendanceResponse,
} from "../models/attendance-model";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Pageable} from "../models/page";
import {Validation} from "../validations/validation";
import {AttendanceValidation} from "../validations/attendance-validation";

export class AttendanceService {
  private static async getEmployeeId(userId: number): Promise<number> {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const employee = await prismaClient.employee.findUnique({
      where: {
        person_id: user.person_id,
      },
    });

    if (!employee) {
      throw new ResponseError(404, "The user is not registered as an employee");
    }

    return employee.id;
  }

  static async checkIn(user: User): Promise<AttendanceResponse> {
    const employeeId = await this.getEmployeeId(user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const existingAttendance = await prismaClient.attendance.findUnique({
      where: {
        employee_id_date: {employee_id: employeeId, date: today},
      },
    });

    if (existingAttendance) {
      throw new ResponseError(400, "You already checked in");
    }

    const officeHour = 8;
    const checkInHour = now.getHours();
    const checkInMinute = now.getMinutes();

    let isLate = false;
    let lateDuration = 0;

    if (checkInHour >= officeHour) {
      if (checkInHour > officeHour || checkInMinute > 0) {
        isLate = true;
        const officeTime = new Date(now).setHours(officeHour, 0, 0, 0);
        lateDuration = Math.floor((now.getTime() - officeTime) / (1000 * 60));
      }
    }

    const attendance = await prismaClient.attendance.create({
      data: {
        employee_id: employeeId,
        date: today,
        check_in_time: now,
        is_late: isLate,
        late_duration: lateDuration,
        status: "present",
      },
    });

    return toAttendanceResponse(attendance);
  }

  static async checkOut(user: User): Promise<AttendanceResponse> {
    const employeeId = await this.getEmployeeId(user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await prismaClient.attendance.findUnique({
      where: {
        employee_id_date: {employee_id: employeeId, date: today},
      },
    });

    if (!attendance) {
      throw new ResponseError(404, "You haven't checked in today");
    }

    if (attendance.check_out_time) {
      throw new ResponseError(404, "You have already checked out today");
    }

    const updatedAttendance = await prismaClient.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        check_out_time: now,
      },
    });

    return toAttendanceResponse(updatedAttendance);
  }

  static async get(user: User): Promise<AttendanceResponse | null> {
    const employeeId = await this.getEmployeeId(user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await prismaClient.attendance.findUnique({
      where: {
        employee_id_date: {employee_id: employeeId, date: today},
      },
    });

    if (!attendance) return null;

    return toAttendanceResponse(attendance);
  }

  static async report(
    request: SearchAttendanceRequest,
  ): Promise<Pageable<AttendanceResponse>> {
    const searchRequest = Validation.validate(
      AttendanceValidation.SEARCH,
      request,
    );

    const skip = (searchRequest.page - 1) * searchRequest.size;
    const filters: any = {
      ...(searchRequest.user_id && {
        employee_id: await this.getEmployeeId(searchRequest.user_id),
      }),
      ...(searchRequest.employee_number && {
        employee_number: searchRequest.employee_number,
      }),
      ...(searchRequest.status && {
        status: searchRequest.status,
      }),
    };

    if (searchRequest.start_date || searchRequest.end_date) {
      filters.date = {
        ...(searchRequest.start_date && {gte: searchRequest.start_date}),
        ...(searchRequest.end_date && {lte: searchRequest.end_date}),
      };
    }

    const [result, total] = await Promise.all([
      prismaClient.attendance.findMany({
        where: filters,
        orderBy: {
          date: "desc",
        },
        skip: skip,
        take: searchRequest.size,
      }),
      prismaClient.attendance.count({
        where: filters,
      }),
    ]);

    return {
      data: result.map(attendance => toAttendanceResponse(attendance)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
