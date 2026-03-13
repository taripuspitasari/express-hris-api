import cron from "node-cron";
import {prismaClient} from "../application/database";

export const attendanceCron = () => {
  cron.schedule("59 23 * * *", async () => {
    console.log("[Cron] Running Auto Clock-out...");
    const employees = await prismaClient.employee.findMany({
      where: {
        status: "active",
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      for (const employee of employees) {
        const attendance = await prismaClient.attendance.findFirst({
          where: {
            employee_id: employee.id,
            date: today,
          },
        });

        if (!attendance) {
          await prismaClient.attendance.create({
            data: {
              employee_id: employee.id,
              date: today,
              status: "absent",
            },
          });
        } else if (attendance && !attendance.check_out_time) {
          await prismaClient.attendance.update({
            where: {
              id: attendance.id,
            },
            data: {
              check_out_time: new Date(),
            },
          });
        }
      }
    }
  });
};
