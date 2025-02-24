import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {User} from "@prisma/client";

export class UserTest {
  static userId: string | null = null;

  static async delete() {
    if (this.userId) {
      await prismaClient.user.deleteMany({
        where: {
          id: this.userId,
        },
      });
      this.userId = null;
    } else {
      await prismaClient.user.deleteMany({
        where: {
          email: "test@gmail.com",
        },
      });
    }
  }

  static async create() {
    const user = await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@gmail.com",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });

    this.userId = user.id;
  }

  static async get(): Promise<User> {
    if (!this.userId) {
      throw new Error("User ID is not set.");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: this.userId,
      },
    });

    if (!user) {
      throw new Error("User is not found.");
    }

    return user;
  }
}

export class JobTest {
  static async deleteAll() {
    if (!UserTest.userId) {
      throw new Error("User ID is not set.");
    }

    await prismaClient.job.deleteMany({
      where: {
        user_id: UserTest.userId,
      },
    });
  }
}
