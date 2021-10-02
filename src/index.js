import app from "./app";
import { connectDb } from "./models";
import chalk from "chalk";
import {init as collectorInit} from './utils/collector'

const port = process.env.PORT || 8080;

connectDb().then(() => {
  console.log(chalk.green("connect to mongo database successfully."));
}).then(() => {
  return collectorInit()
}).then(() => {
  app.listen(port, () =>
    console.log(
      `${chalk.blue("Test Project")} ${chalk.green(
        "app listening on port"
      )} ${chalk.greenBright(port)}`
    )
  );
});
