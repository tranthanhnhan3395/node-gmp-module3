import express, { NextFunction } from "express";
import "./configs/dotenv.config";
import { sequelize } from "./configs/sequelize.config";
import { userRouter } from "./routes";
import { Logger } from "./logger";
import {
  errorHandlingMiddleware,
  routeNotExistsHandlingMiddleware,
  morganMiddleware,
} from "./middlewares";

const app = express();
const port = process.env.APPLICATION_PORT ?? 3002;

app.use(express.json());
app.use(morganMiddleware);

app.get("/", function (req, res) {
  res.json({ message: "module 3 application is running" });
});

app.get("/databaseconnection", async function (req, res, next: NextFunction) {
  try {
    await sequelize.authenticate();
    res.json({ message: "successfully connected to database" });
  } catch (err) {
    next(err);
  }
});

app.use("/users", userRouter);

app.use(errorHandlingMiddleware);

app.use(routeNotExistsHandlingMiddleware);

app.listen(port, () => {
  Logger.info(`server started on port ${port}`);
});
