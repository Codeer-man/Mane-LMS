import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chapterTable } from "./chapter";
import { relations } from "drizzle-orm";
import { courseTable } from "./course";

export const lessonTable = pgTable("lesson", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumnailKey: text(), // fixed spelling
  videoKey: text(),
  position: integer(),
  chapterId: uuid("chapter_id").references(() => chapterTable.id, {
    onDelete: "cascade",
  }),
  courseId: uuid("course_id").references(() => courseTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessonRelations = relations(lessonTable, ({ one }) => ({
  chapter: one(chapterTable, {
    fields: [lessonTable.chapterId],
    references: [chapterTable.id],
  }),
  course: one(courseTable, {
    fields: [lessonTable.courseId],
    references: [courseTable.id],
  }),
}));
