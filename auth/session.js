import path from "path";
import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
import mongoose from "mongoose";
import { User } from "../db.js";
const sessionFile = "session.json";
const session = path.join("session", sessionFile);
export async function createSession(token) {
  const data = JSON.stringify({ token, storge: "clould" });
  if (fs.existsSync(session)) {
    console.log(chalk.red("Session file already exists"));
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "check",
        message: "Do You Want To reCreate The session?",
      },
    ]);
    if (answer.check) {
      fs.unlinkSync(session, (err) => {
        if (err) {
          console.log(chalk.red(err));
          return;
        }
        console.log(chalk.green("Remove The Old Session"));
      });
      if (!fs.existsSync("session")) {
        fs.mkdirSync("session", { recursive: true });
      }
      fs.writeFileSync(session, data);
      console.log(chalk.green("Session created"));
    } else {
      console.log(chalk.red("Creating Session Is Canceled"));
    }
  } else {
    fs.mkdirSync("session");
    fs.writeFileSync(session, data);
    console.log(chalk.green("Session created"));
  }
}
export async function getSession() {
  if (!fs.existsSync(session)) {
    // console.log(chalk.red("There is Not Session"));
    return;
  }
  try {
    // Read the session file
    const file = fs.readFileSync(session, "utf-8"); // Read file as UTF-8 string
    const json = JSON.parse(file); // Parse the JSON content
    // const user = await User.findOne({ session: json.token }).select(
    //   "-password"
    // );

    return json;
  } catch (err) {
    console.error(chalk.red(`Error reading session file: ${err.message}`));
  }
}
