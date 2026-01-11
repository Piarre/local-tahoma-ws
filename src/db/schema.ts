import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const podsTable = pgTable("pods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  host: varchar({ length: 255 }).notNull(),
  pin: varchar({ length: 255 }).notNull().unique(),
  txt: varchar({ length: 1024 }).notNull(),
});
