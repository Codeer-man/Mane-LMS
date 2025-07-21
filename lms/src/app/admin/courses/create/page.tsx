"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCourseSchema, createCourseType } from "@/lib/zodschema";
import { ArrowLeft, CreativeCommons, Loader2, SparkleIcon } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseCategories,
  courseLevelEnum,
  courseStatus,
} from "@/constant/createCourse";
import { RichTextEditor } from "@/components/rich-text-editor/editro";
import { Uploader } from "@/components/fileUpload/uploader";
import { CreateCourseAction } from "@/actions/course_create";
import { useRouter } from "next/navigation";

export default function CreateCourse() {
  const router = useRouter();
  const [isPending, startTransistion] = useTransition();

  const form = useForm<createCourseType>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
      describe: "",
      category: "Web Development",
      duration: 0,
      filekey: "",
      level: "Beginner",
      price: 0,
      smallDescription: "",
      slug: "",
      status: "Draft",
    },
  });

  function onSubmit(value: createCourseType) {
    console.log(value, "value");

    startTransistion(async () => {
      try {
        const result = await CreateCourseAction(value);

        if (result.success === false) {
          toast.error(result.message);
        }

        if (result.status === "success") {
          toast.success("New Course had been created");
          router.push("/admin/courses");
        }
      } catch (error) {
        toast.error("something went worng");
        return console.error(error);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-5">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <ArrowLeft size={4} />
        </Link>
        <h1 className="text-2xl font-semibold">Create Course</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Basic Information
          </CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        <Input
                          placeholder="Generate Slug"
                          {...field}
                          disabled
                        />
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
                    const slug = Slugify(formValue);
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    Creating...{" "}
                    <Loader2 size={4} className=" animate-spin" />{" "}
                  </>
                ) : (
                  <>
                    <CreativeCommons size={4} className=" cursor-pointer" />{" "}
                    Create Course
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
