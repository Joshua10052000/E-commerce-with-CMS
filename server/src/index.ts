import express from "express";
import env from "./lib/env.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/greet", (_, res) => {
  res.send("Hello, World!");
});

app.listen(env.PORT, () => {
  console.log(`Server running on port:${env.PORT}`);
  console.log(`http://localhost:${env.PORT}`);
});
