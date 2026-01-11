import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: Database URL is required
const client = new SQL(process.env.DATABASE_URL!);

export const db = drizzle({ client, schema });

export type Database = typeof db;
export * from "./schema";
