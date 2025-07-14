import {User} from "@prisma/client";
import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@gmail.com",
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        email: "test@gmail.com",
        password: await bcrypt.hash("test", 10),
        name: "test",
        role: "applicant",
        token: "test",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        email: "test@gmail.com",
      },
    });

    if (!user) {
      throw new Error("User is not found");
    }

    return user;
  }

  static async deleteForUpdate() {
    await prismaClient.user.deleteMany({
      where: {
        token: "test",
      },
    });
  }
}
