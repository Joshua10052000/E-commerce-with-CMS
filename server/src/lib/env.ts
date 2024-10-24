import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

process.loadEnvFile();

const env = createEnv({
  server: {
    PORT: z.string(),
  },
  runtimeEnv: process.env,
});

export default env;
