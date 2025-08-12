import {User} from "@prisma/client";
import {
  AttendanceResponse,
  toAttendanceResponse,
} from "../models/attendance-model";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class AttendanceService {
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

  static async checkIn(user: User): Promise<AttendanceResponse> {
    const employeeId = await this.getEmployeeId(user.id);
    const today = new Date(new Date().toISOString().split("T")[0]);
    const existingAttendance = await prismaClient.attendance.findFirst({
      where: {
        employee_id: employeeId,
        date: today,
      },
    });

    if (existingAttendance) {
      throw new ResponseError(400, "You already checked in.");
    }

    const attendance = await prismaClient.attendance.create({
      data: {
        employee_id: employeeId,
        check_in_time: new Date(),
        date: today,
      },
    });

    return toAttendanceResponse(attendance);
  }

  static async checkOut(user: User): Promise<AttendanceResponse> {
    const employeeId = await this.getEmployeeId(user.id);
    const today = new Date(new Date().toISOString().split("T")[0]);
    const attendanceToUpdate = await prismaClient.attendance.findFirst({
      where: {
        employee_id: employeeId,
        date: today,
        check_out_time: null,
      },
    });

    if (!attendanceToUpdate) {
      throw new ResponseError(400, "You haven't checked in today");
    }

    const attendance = await prismaClient.attendance.update({
      where: {
        id: attendanceToUpdate.id,
      },
      data: {
        check_out_time: new Date(),
      },
    });

    return toAttendanceResponse(attendance);
  }

  static async history(user: User): Promise<Array<AttendanceResponse>> {
    const employeeId = await this.getEmployeeId(user.id);
    const attendances = await prismaClient.attendance.findMany({
      where: {
        employee_id: employeeId,
      },
    });

    return attendances.map(attendance => toAttendanceResponse(attendance));
  }

  static async get(user: User): Promise<AttendanceResponse | null> {
    const employeeId = await this.getEmployeeId(user.id);
    const today = new Date(new Date().toISOString().split("T")[0]);
    const attendance = await prismaClient.attendance.findFirst({
      where: {
        employee_id: employeeId,
        date: today,
      },
    });

    if (!attendance) return null;

    return toAttendanceResponse(attendance);
  }
}
