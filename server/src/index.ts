import express from "express";
import env from "./lib/env.js";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import appRouter from "./routes/index.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.listen(env.PORT, () => {
  console.log(`Server running on port:${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
});
