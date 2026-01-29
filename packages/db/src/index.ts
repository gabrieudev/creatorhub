import { env } from "@CreatorHub/env/server";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schema/schema";
import * as relations from "./schema/relations";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, {
  schema: {
    ...schema,
    ...relations,
  },
});
