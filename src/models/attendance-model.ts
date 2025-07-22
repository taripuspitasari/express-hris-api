import {Attendance} from "@prisma/client";

export type AttendanceResponse = {
  id: number;
  check_in_time: Date;
  check_out_time?: string;
  date: Date;
};

export function toAttendanceResponse(
  attendance: Attendance
): AttendanceResponse {
  return {
    id: attendance.id,
    check_in_time: attendance.check_in_time,
    date: attendance.date,
  };
}
