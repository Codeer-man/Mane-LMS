import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function CoursePage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div>Here are the courses that you created</div>
    </>
  );
}
