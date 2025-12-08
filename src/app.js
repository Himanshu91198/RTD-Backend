import express from "express";
import userRouter from "./routes/users.route.js";
import documentRouter from "./routes/documents.route.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/documents", documentRouter);
export default app;
