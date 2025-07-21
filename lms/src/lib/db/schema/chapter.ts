import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { courseTable } from "./course";
import { relations } from "drizzle-orm";
import { lessonTable } from "./lesson";

export const chapterTable = pgTable("chapter", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  position: integer(),
  courseId: uuid("course_id").references(() => courseTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapterRelations = relations(chapterTable, ({ one, many }) => ({
  course: one(courseTable, {
    fields: [chapterTable.courseId],
    references: [courseTable.id],
  }),
  lessons: many(lessonTable),
}));
