import {prismaClient} from "../../src/application/database";

export class DepartmentTest {
  static async create() {
    return await prismaClient.department.create({
      data: {
        name: "HR",
        description: "Human Resource",
      },
    });
  }

  static async deleteAll() {
    await prismaClient.department.deleteMany({});
  }
}
