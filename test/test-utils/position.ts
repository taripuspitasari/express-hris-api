import {prismaClient} from "../../src/application/database";

export class PositionTest {
  static async delete() {
    await prismaClient.position.deleteMany({});
    await prismaClient.department.deleteMany({});
  }

  static async create() {
    return await prismaClient.position.create({
      data: {
        name: "HR Staff",
        level: "Staff",
        department: {
          connectOrCreate: {
            where: {name: "HR"},
            create: {name: "HR", description: "Human Resources Department"},
          },
        },
      },
    });
  }
}
