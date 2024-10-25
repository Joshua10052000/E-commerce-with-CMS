import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import env from "./lib/env.js";
import appRouter from "./routes/index.js";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./lib/trpc.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(env.SESSION_SECRET));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

app.listen(env.PORT, () => {
  console.log(`Server running on port:${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
});
