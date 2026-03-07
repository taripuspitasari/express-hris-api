import {prismaClient} from "../../src/application/database";
import bcrypt from "bcrypt";
import {PositionTest} from "./position";
import {EmployeeTest} from "./employee";

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
    return await prismaClient.user.create({
      data: {
        password: await bcrypt.hash("test_123", 10),
        token: "testuser",
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
                  where: {name: "user"},
                  create: {name: "user"},
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
        token: "testhr",
        person: {
          create: {fullname: "Test User", email: "testupdate@gmail.com"},
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

  static async createWithEmployee() {
    const currentUser = await this.create();
    const currentPosition = await PositionTest.create();
    await EmployeeTest.create(
      currentUser.person_id,
      currentPosition.department_id,
      currentPosition.id,
    );
    return currentUser;
  }
}
