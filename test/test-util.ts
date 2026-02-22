import {User} from "@prisma/client";
import {prismaClient} from "../src/application/database";

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
