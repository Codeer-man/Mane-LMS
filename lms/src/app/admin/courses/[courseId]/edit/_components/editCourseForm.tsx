"use client";

import { getSingleCourse } from "@/actions/course_create";
import { Uploader } from "@/components/fileUpload/uploader";
import { RichTextEditor } from "@/components/rich-text-editor/editro";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  courseCategories,
  courseLevelEnum,
  courseStatus,
} from "@/constant/createCourse";
import { CourseSchemaType } from "@/lib/db/schema/course";
import { CreateCourseSchema, createCourseType } from "@/lib/zodschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreativeCommons, Loader2, SparkleIcon } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { EditCourse } from "./action";
import { useRouter } from "next/navigation";

interface iAppProps {
  data: getSingleCourse;
}

export default function EditCourseForm({ data }: iAppProps) {
  const router = useRouter();
  const [isPending, startTransistion] = useTransition();

  const form = useForm<createCourseType>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: data?.title,
      describe: data?.describe,
      category: data?.category as CourseSchemaType["category"],
      duration: data?.duration,
      filekey: data?.filekey,
      level: data?.level,
      price: data?.price,
      smallDescription: data?.smallDescription,
      slug: data?.slug,
      status: data?.status,
    },
  });

  function onSubmit(value: createCourseType) {
    startTransistion(async () => {
      try {
        const edit = await EditCourse(value, data!.id);

        if (edit?.error) {
          throw new Error(edit.error);
        }

        if (edit?.status === "success") {
          toast.success("course has been updated");
          form.reset();
          router.push("/admin/courses");
        }
      } catch (error) {
        toast.error("something went worng");
        return console.error(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-5  justify-end">
          <FormField
            {...form}
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Generate Slug" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="w-fit mt-5 cursor-pointer"
            onClick={() => {
              const formValue = form.getValues("title");
              if (formValue === "") {
                return toast.error("Please Give a title first");
              }
              const slug = slugify(formValue);
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate Slug <SparkleIcon className="ml-2 size-6" />
          </Button>
        </div>
        <FormField
          {...form}
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="Enter small description of your Course"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          {...form}
          control={form.control}
          name="describe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          {...form}
          control={form.control}
          name="filekey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course thumnail </FormLabel>
              <FormControl>
                {/* <Input
                        placeholder="Drag the image url"
                        type="file"
                        {...field}
                      /> */}
                <Uploader onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            {...form}
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((cate) => (
                      <SelectItem key={cate} value={cate}>
                        {cate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            {...form}
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLevelEnum.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            {...form}
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Duratino (hrs)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the duratino of your course"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            {...form}
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the amount"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          {...form}
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Course Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatus.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Updating... <Loader2 size={4} className=" animate-spin" />{" "}
            </>
          ) : (
            <>
              <CreativeCommons size={4} className=" cursor-pointer" /> update
              Course
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
