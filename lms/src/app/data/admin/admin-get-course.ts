import { desc } from "drizzle-orm";
import AdminRequire from "./require-admin";
import { db } from "@/lib/db";

export async function GetAdminCourses() {
  await AdminRequire();

  const data = await db.query.courseTable.findMany({
    orderBy: (course) => [desc(course.createdAt)],
  });

  return data;
}
