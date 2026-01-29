import { db } from "@CreatorHub/db";
import * as schema from "@CreatorHub/db/schema/schema";
import { env } from "@CreatorHub/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.usersInApp,
      session: schema.sessionInApp,
      account: schema.accountInApp,
    },
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  user: {
    additionalFields: {
      lastSigninAt: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
      profile: {
        type: "json",
        required: false,
      },
    },
  },
});
