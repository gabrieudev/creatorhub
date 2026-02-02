import { env } from "@CreatorHub/env/server";
import { neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import * as relations from "./schema/relations";
import * as schema from "./schema/schema";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    ...schema,
    ...relations,
  },
});
