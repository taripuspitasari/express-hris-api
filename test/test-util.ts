import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {User} from "@prisma/client";

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@gmail.com", // Ganti pencarian ID dengan email untuk memastikan data yang benar dihapus
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@gmail.com",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        email: "test@gmail.com", // Cari berdasarkan email, bukan ID hardcoded
      },
    });
    if (!user) {
      throw new Error("User is not found.");
    }
    return user;
  }
}
