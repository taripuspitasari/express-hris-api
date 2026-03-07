import {prismaClient} from "../../src/application/database";

export class AttendanceTest {
  private static async getEmployeeId(userId: number) {
    const employee = await prismaClient.employee.findFirst({
      where: {person: {user: {id: userId}}},
    });
    if (!employee) throw new Error("Employee not found for test user");
    return employee.id;
  }

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
    const employeeId = await this.getEmployeeId(userId);
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
