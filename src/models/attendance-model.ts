import {Attendance} from "@prisma/client";

export type AttendanceResponse = {
  id: number;
  check_in_time: Date;
  check_out_time: Date | null;
  date: Date;
};

export type SearchAttendanceRequest = {
  id: number;
  page: number;
  size: number;
};

export function toAttendanceResponse(
  attendance: Attendance
): AttendanceResponse {
  return {
    id: attendance.id,
    check_in_time: attendance.check_in_time,
    check_out_time: attendance.check_out_time,
    date: attendance.date,
  };
}
