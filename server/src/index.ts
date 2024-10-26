import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import env from "./lib/env.js";
import appRouter from "./routes/index.js";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./lib/trpc.js";
import store from "./lib/store.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: [env.CONTENT_MANGEMENT_URL], credentials: true }));

app.use(cookieParser(env.SESSION_SECRET));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, _, next) => {
  console.log(`Method: ${req.method}`);
  console.log(`Route: ${req.url}`);

  next();
});

app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

app.listen(env.PORT, () => {
  console.log(`Server running on port:${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
});
