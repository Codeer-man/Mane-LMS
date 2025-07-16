import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImgConstructUrl from "@/hooks/img-construct";
import { courseTable } from "@/lib/db/schema/course";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
// import { createCourseType } from "@/lib/zodschema";
import { type InferSelectModel } from "drizzle-orm";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  SchoolIcon,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type courseType = InferSelectModel<typeof courseTable>;

type Props = {
  data: courseType;
};

export default function AdminCourse({ data }: Props) {
  const thunmail = ImgConstructUrl(data.filekey);

  return (
    <Card className=" group relative py-0 gap-0">
      <div className=" absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size="icon">
              <MoreVertical size={4} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-10">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.slug}`}>
                <Eye />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thunmail}
        alt="Image"
        width={600}
        height={600}
        className=" w-full rounded-lg aspect-video h-full object-cover "
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className=" font-medium text-lg line-clamp-2 hover:underline transition-colors group-hover:text-primary"
        >
          {data.title}
        </Link>
        <p className=" line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">
          {data.smallDescription}{" "}
        </p>

        <div className="mt-2 flex items-center gap-x-5">
          <div className="flex gap-2 items-center">
            <TimerIcon className=" size-6 p-1 rounded-md text-primary bg-primary/20" />
            <p className="text-xm text-muted-foreground">{data.duration}h </p>
          </div>
          <div className="flex gap-2 items-center">
            <SchoolIcon className=" size-6 p-1 rounded-md text-primary bg-primary/20" />
            <p className="text-xm text-muted-foreground">{data.level} </p>
          </div>
        </div>
        <Link
          className={buttonVariants({ className: "w-full mt-4" })}
          href={`/admin/courses/${data.id}/edit`}
        >
          <ArrowRight className=" size-5 border p-1 rounded-md " /> Edit Course
        </Link>
      </CardContent>
    </Card>
  );
}
