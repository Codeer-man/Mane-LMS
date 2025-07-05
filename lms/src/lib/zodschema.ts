import z from "zod";
import { courseLevelEnum, coursestatusEnum } from "./db/schema/course";
import { courseCategories } from "@/constant/createCourse";


export const CreateCourseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "At least 3 word is required" })
    .max(20, { message: "Cannot exced 20 words" }),
  describe: z
    .string()
    .min(5, { message: "At least 5 word is required" })
    .max(200, { message: "Cannot exced 200 words" }),
  filekey: z.string({ message: "File key is required" }),
  price: z.coerce.number(),
  duration: z.coerce.number(),
  level: z.enum(courseLevelEnum.enumValues),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z.string(),
  slug: z.string(),
  status: z.enum(coursestatusEnum.enumValues),
});

export type createCourseType = z.infer<typeof CreateCourseSchema>;
