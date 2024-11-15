import express, { Application, Request, Response } from "express";

import globalErrorHandler from "./app/Error-Handler/globalErrorHandler";
import normalMiddleware from "./app/middleware/normalMiddleware";
import { authRoutes } from "./app/Modules/Auth/Auth.route";
import { userRoutes } from "./app/Modules/User/User.route";

const app: Application = express();
normalMiddleware(app);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.all("*", (req: Request, res: Response, next) => {
  const error = new Error(`Can't find ${req.url} on the server`);
  next(error);
});

// global error handle
app.use(globalErrorHandler);

export default app;
