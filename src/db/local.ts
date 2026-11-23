// Alleen voor lokaal testen met gewone Postgres (USE_LOCAL_PG=1, zie next.config.ts).
// Productie gebruikt src/db/index.ts met Neon.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const db = drizzle(
  new Pool({
    connectionString:
      process.env.LOCAL_DATABASE_URL ??
      "postgresql://kerst:kerst@127.0.0.1:5432/kerst_test",
  }),
  { schema },
);
