import {prismaClient} from "../../src/application/database";
import {EmployeeTest} from "./employee";

export class AttendanceTest {
  static async deleteAll() {
    await prismaClient.attendance.deleteMany({});
    await prismaClient.employee.deleteMany({});
    await prismaClient.position.deleteMany({});
    await prismaClient.department.deleteMany({});
  }

  static async checkIn(
    userId: number,
    date: Date,
    checkInTime: Date | null = new Date(),
  ) {
    const employeeId = await EmployeeTest.getEmployeeId(userId);
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    return await prismaClient.attendance.create({
      data: {
        employee_id: employeeId,
        date: dateOnly,
        check_in_time: checkInTime,
        status: "present",
        is_late: false,
        late_duration: 0,
      },
    });
  }
}
