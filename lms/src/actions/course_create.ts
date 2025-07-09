"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema/course";
import { CreateCourseSchema, createCourseType } from "@/lib/zodschema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
// import { safeParse } from "zod/v4/core";

export async function CreateCourseAction(data: createCourseType) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return {
      success: false,
      status: 401,
      message: "Please authenticate first",
    };
  }

  try {
    const validate = CreateCourseSchema.safeParse(data);

    if (!validate.data) {
      return {
        success: false,
        status: 400,
        message: "Invalid form data",
      };
    }

    const existingSlug = await db
      .select()
      .from(courseTable)
      .where(eq(courseTable.slug, validate.data?.slug))
      .limit(1);

    if (existingSlug.length > 0) {
      return {
        success: false,
        message:
          "The slug already exist. Please try giving other title and genetate slug",
      };
    }
    console.log(validate, "server");

    const result = await db
      .insert(courseTable)
      .values({ ...validate.data, userId: session?.user.id });

    revalidatePath("/admin/courses");
    // revalidatePath("/admin/courses");
    console.log(result);

    return {
      status: "success",
      message: "New Course has been created",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
