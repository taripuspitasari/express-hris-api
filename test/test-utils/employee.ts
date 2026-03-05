import {prismaClient} from "../../src/application/database";

export class EmployeeTest {
  static async delete() {
    await prismaClient.employee.deleteMany({});
    await prismaClient.position.deleteMany({});
    await prismaClient.department.deleteMany({});
  }

  static async create(
    personId: number,
    deparmentId: number,
    positionId: number,
  ) {
    return await prismaClient.employee.create({
      data: {
        person_id: personId,
        department_id: deparmentId,
        position_id: positionId,
        join_date: new Date("2026-03-05"),
        status: "active",
        employee_number: "EMP-00001",
      },
    });
  }
}
