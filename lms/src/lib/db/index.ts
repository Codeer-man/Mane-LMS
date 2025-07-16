import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as auth from "./schema/auth";
import * as course from "./schema/course";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: { ...auth, ...course } });

// ! to get the schema type from it
// type courseType = InferSelectModel<typeof courseTable>;
