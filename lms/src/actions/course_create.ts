"use server";

import AdminRequire from "@/app/data/admin/require-admin";

import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema/course";
import { CreateCourseSchema, createCourseType } from "@/lib/zodschema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function CreateCourseAction(data: createCourseType) {
  const session = await AdminRequire();

  if (!session || !session.user) {
    return {
      success: false,
      status: 401,
      message: "Please authenticate first",
    };
  }

  if (session.user.role === "user") {
    return {
      success: false,
      message: "Only Admin are allowed",
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

    await db
      .insert(courseTable)
      .values({ ...validate.data, userId: session?.user.id });

    revalidatePath("/admin/courses");

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

export async function GetAdminCourse() {
  await AdminRequire();

  try {
    const data = await db.query.courseTable.findMany({
      orderBy: desc(courseTable.createdAt),
      columns: {
        id: true,
        title: true,
        smallDescription: true,
        duration: true,
        level: true,
        status: true,
        price: true,
        filekey: true,
        category: true,
        slug: true,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export type AdminCourseType = Awaited<ReturnType<typeof GetAdminCourse>>;

export async function EditCourse(id: string) {
  await AdminRequire();

  try {
    //   const course = await db.query.courseTable.findFirst({
    //     where: (course, { eq }) => eq(course.id, id),
    //   });
    const course = await db.query.courseTable.findFirst({
      where: eq(courseTable.id, id),
      with: {
        chapters: {
          columns: {
            id: true,
            position: true,
            title: true,
          },
          with: {
            lessons: {
              columns: {
                id: true,
                title: true,
                description: true,
                thumnailKey: true,
                position: true,
                videoKey: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return notFound();
    }

    return course;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return;
  }
}

export type getSingleCourse = Awaited<ReturnType<typeof EditCourse>>;
