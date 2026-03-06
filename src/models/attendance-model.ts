import {Attendance} from "@prisma/client";

export type AttendanceResponse = {
  id: number;
  date: Date;
  check_in_time: Date | null;
  check_out_time: Date | null;
  status: string;
  is_late: boolean;
  late_duration: number;
};

export type SearchAttendanceRequest = {
  user_id?: number;
  employee_number?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  is_late?: boolean;
  page: number;
  size: number;
};

export function toAttendanceResponse(
  attendance: Attendance,
): AttendanceResponse {
  return {
    id: attendance.id,
    date: attendance.date,
    check_in_time: attendance.check_in_time,
    check_out_time: attendance.check_out_time,
    status: attendance.status,
    is_late: attendance.is_late,
    late_duration: attendance.late_duration,
  };
}
