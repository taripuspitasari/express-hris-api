import {prismaClient} from "../../src/application/database";
import {EmployeeTest} from "./employee";

export class LeaveTest {
  static async deleteAll() {
    await prismaClient.leave.deleteMany({});
    await prismaClient.employee.deleteMany({});
    await prismaClient.position.deleteMany({});
    await prismaClient.department.deleteMany({});
  }

  static async create(userId: number) {
    const employeeId = await EmployeeTest.getEmployeeId(userId);

    return await prismaClient.leave.create({
      data: {
        employee_id: employeeId,
        type: "annual",
        start_date: new Date(),
        end_date: new Date(),
        total_days: 1,
        reason: "Family vacation",
      },
    });
  }
}
