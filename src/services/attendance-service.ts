import {User} from "@prisma/client";
import {
  AttendanceResponse,
  toAttendanceResponse,
} from "../models/attendance-model";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class AttendanceService {
  static async checkIn(user: User): Promise<AttendanceResponse> {
    const today = new Date(new Date().toISOString().split("T")[0]);
    const existingAttendance = await prismaClient.attendance.findFirst({
      where: {
        user_id: user.id,
        date: today,
        check_out_time: null,
      },
    });

    if (existingAttendance) {
      throw new ResponseError(400, "You already checked in.");
    }

    const attendance = await prismaClient.attendance.create({
      data: {
        user_id: user.id,
        check_in_time: new Date(),
        date: today,
      },
    });

    return toAttendanceResponse(attendance);
  }

  static async checkOut(user: User): Promise<AttendanceResponse> {
    const today = new Date(new Date().toISOString().split("T")[0]);
    const attendanceToUpdate = await prismaClient.attendance.findFirst({
      where: {
        user_id: user.id,
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
    const attendances = await prismaClient.attendance.findMany({
      where: {
        user_id: user.id,
      },
    });

    return attendances.map(attendance => toAttendanceResponse(attendance));
  }

  static async get(user: User): Promise<AttendanceResponse | null> {
    const today = new Date(new Date().toISOString().split("T")[0]);
    const attendance = await prismaClient.attendance.findFirst({
      where: {
        user_id: user.id,
        date: today,
      },
    });

    if (!attendance) return null;

    return toAttendanceResponse(attendance);
  }
}
