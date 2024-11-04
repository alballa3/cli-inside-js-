import inquirer from "inquirer";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import { reopenCLI } from "../auth/main.js";
const session = path.join(process.cwd(), "session", "session.json");

async function storge() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Which Storage You want",
      choices: ["locally", "clould"],
    },
  ]);

  try {
    // Check if the session file exists
   await  fs.access(session);

    // Read the session file
    const data =await fs.readFile(session, "utf-8");
    const sessionData = JSON.parse(data);
    sessionData.storge=answer.answer
    console.log(chalk.green(`The storge is changed to ${answer.answer}`));
  } catch (error) {
    console.error(
      "Error accessing or reading the session file:",
      error.message
    );
  }
}
export async function settings() {
  const answer = await inquirer.prompt([
    {
      type: "rawlist",
      name: "settings",
      message: "What do you want to change?",
      choices: ["storge", "profile", "edit", "back"],
    },
  ]);
  switch (answer.settings) {
    case "storge":
      storge();
      break;
    case "back":
        reopenCLI()
        break;
  }
}
