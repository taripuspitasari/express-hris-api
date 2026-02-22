import {prismaClient} from "../../src/application/database";
import bcrypt from "bcrypt";

export class UserTest {
  static async delete() {
    await prismaClient.person.deleteMany({
      where: {
        email: {
          in: ["test@gmail.com", "testupdate@gmail.com"],
        },
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        password: await bcrypt.hash("test_123", 10),
        token: "test",
        person: {
          create: {
            fullname: "Test User",
            email: "test@gmail.com",
          },
        },
        roles: {
          create: [
            {
              role: {
                connectOrCreate: {
                  where: {id: 1},
                  create: {id: 1, name: "employee"},
                },
              },
            },
          ],
        },
      },
    });
  }

  static async createWithRole(roleName: string) {
    return await prismaClient.user.create({
      data: {
        password: await bcrypt.hash("test_123", 10),
        token: "test",
        person: {
          create: {fullname: "Test User", email: "test@gmail.com"},
        },
        roles: {
          create: [
            {
              role: {
                connect: {name: roleName},
              },
            },
          ],
        },
      },
    });
  }
}
