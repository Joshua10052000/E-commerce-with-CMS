import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
process.loadEnvFile();
const env = createEnv({
    server: {
        PORT: z.string(),
        DATABASE_URL: z.string(),
        NODE_ENV: z.enum(["production", "development"]),
        SESSION_SECRET: z.string(),
        CONTENT_MANGEMENT_URL: z.string(),
    },
    runtimeEnv: process.env,
});
export default env;
