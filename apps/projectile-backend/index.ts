import express from "express";
import userRouter from "./router/user";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});