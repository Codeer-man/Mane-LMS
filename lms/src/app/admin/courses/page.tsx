import { GetAdminCourse } from "@/actions/course_create";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AdminCourse from "./_components/adminCourse";

export default async function CoursePage() {
  const data = await GetAdminCourse();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
        {data.map((course) => (
          <AdminCourse key={course.id} data={course!} />
        ))}
      </div>
    </>
  );
}
