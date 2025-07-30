"use server";

import AdminRequire from "@/app/data/admin/require-admin";
import { db } from "@/lib/db";
import { chapterTable } from "@/lib/db/schema/chapter";
import { courseTable } from "@/lib/db/schema/course";
import { lessonTable } from "@/lib/db/schema/lesson";
import {
  CreateChapterSchema,
  createChapterType,
  CreateCourseSchema,
  createCourseType,
  createLessonValidation,
  lessonCreationType,
} from "@/lib/zodschema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function reorderLessonFunction(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
) {
  await AdminRequire();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    const updates = lessons.map((lesson) =>
      db
        .update(lessonTable)
        .set({
          position: lesson.position,
        })
        .where(
          and(
            eq(lessonTable.id, lesson.id),
            eq(lessonTable.chapterId, chapterId)
          )
        )
    );

    await Promise.all(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
    };
  }
}

export async function reorderChapterFunction(
  courseId: string,
  chapters: { id: string; position: number }[]
) {
  await AdminRequire();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided",
      };
    }

    const update = chapters.map((chapter) =>
      db
        .update(chapterTable)
        .set({
          position: chapter.position,
        })
        .where(
          and(
            eq(chapterTable.id, chapter.id),
            eq(chapterTable.courseId, courseId)
          )
        )
    );

    await Promise.all(update);
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "chapter reordered successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error || "failed to reorder the chapter",
    };
  }
}

export async function createChapter(value: createChapterType) {
  await AdminRequire();
  try {
    const result = CreateChapterSchema.safeParse(value);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const maxPos = await db
      .select({ position: chapterTable.position })
      .from(chapterTable)
      .where(eq(chapterTable.courseId, result.data.courseId))
      .orderBy(desc(chapterTable.position))
      .limit(1);

    const maxPosition = maxPos[0]?.position ?? 0;

    await db.insert(chapterTable).values({
      title: result.data.name,
      position: maxPosition + 1,
      courseId: result.data.courseId,
    });

    revalidatePath(`/admin/course/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "New Chapter has been added",
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
    };
  }
}

export async function createLesson(value: lessonCreationType) {
  await AdminRequire();
  try {
    const result = createLessonValidation.safeParse(value);

    if (!result.success) {
      return {
        status: "error",
        message: "validation failed",
      };
    }

    const maxPos = await db
      .select({ position: lessonTable.position })
      .from(lessonTable)
      .where(eq(lessonTable.chapterId, result.data.chapterId))
      .orderBy(desc(lessonTable.position))
      .limit(1);

    const maxPosition = maxPos[0]?.position ?? 0;

    await db.insert(lessonTable).values({
      title: result.data.name,
      description: result.data.description,
      position: maxPosition + 1,
      thumnailKey: result.data.thumnailKey,
      videoKey: result.data.videoKey,
      chapterId: result.data.chapterId,
    });

    revalidatePath(`/admin/course/${result.data.courseId}/edit`);
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "something went wrong",
    };
  }
}
