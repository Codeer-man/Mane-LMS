import {
  integer,
  interval,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { InferSelectModel, relations } from "drizzle-orm";

export const courseLevelEnum = pgEnum("course_level", [
  "Beginner",
  "Intermediate",
  "Advance",
]);

export const coursestatusEnum = pgEnum("course_status", [
  "Draft",
  "Published",
  "Archived",
]);

export const courseCategoriesEnum = pgEnum("course_category", [
  "Web Development",
  "Data Science",
  "Mobile App Development",
  "UI/UX Design",
  "Cybersecurity",
  "Artificial Intelligence",
  "Cloud Computing",
  "Digital Marketing",
  "Game Development",
  "Blockchain Technology",
]);
export const courseTable = pgTable("Courses", {
  id: uuid("_id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  describe: text("description").notNull(),
  filekey: text("file_key").notNull().unique(),
  price: integer("price").notNull().default(0),
  duration: interval({ fields: "hour" }).default("0 hrs").notNull(),
  level: courseLevelEnum("level").notNull().default("Beginner"),

  category: courseCategoriesEnum("category").notNull(),
  smallDescription: text("small_description").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  status: coursestatusEnum("status").default("Draft").notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CourseSchemaType = InferSelectModel<typeof courseTable>;

// relation user course
export const userRelation = relations(user, ({ many }) => ({
  courseTable: many(courseTable),
}));

export const courseRelation = relations(courseTable, ({ one }) => ({
  author: one(user, {
    fields: [courseTable.userId],
    references: [user.id],
  }),
}));
