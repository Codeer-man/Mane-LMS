"use server";

import AdminRequire from "@/app/data/admin/require-admin";
import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema/course";
import { CreateCourseSchema, createCourseType } from "@/lib/zodschema";
import { eq } from "drizzle-orm";

export async function EditCourse(data: createCourseType, id: string) {
  await AdminRequire();

  try {
    const result = CreateCourseSchema.safeParse(data);

    if (result.error) {
      return {
        status: false,
        error: "invalid data",
      };
    }

    await db
      .update(courseTable)
      .set({
        ...result.data,
      })
      .where(eq(courseTable.id, id));

    return { status: "success", message: "Course Updates" };
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function GetChapter() {
    
}