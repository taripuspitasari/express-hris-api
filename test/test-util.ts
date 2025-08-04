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
        password: await bcrypt.hash("test_123", 10),
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

export class AttendanceTest {
  static async deleteAll(userId: number) {
    await prismaClient.attendance.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }

  static async checkIn(currentUser: User) {
    await prismaClient.attendance.create({
      data: {
        user_id: currentUser.id,
        check_in_time: new Date(),
        date: new Date(new Date().toISOString().split("T")[0]),
      },
    });
  }
}

export class DepartmentTest {
  static async create() {
    await prismaClient.department.create({
      data: {
        name: "HR",
        description: "Human Resource",
      },
    });
  }

  static async delete() {
    await prismaClient.department.deleteMany({});
  }

  static async get() {
    const department = await prismaClient.department.findFirst({
      where: {
        name: "HR",
      },
    });

    if (!department) {
      throw new Error("Department is not found.");
    }

    return department;
  }
}
