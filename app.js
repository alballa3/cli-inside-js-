import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import readline from "readline";
import { getSession } from "./auth/session.js";
import { auth } from "./auth/main.js";
import { main }from "./app/main.js"
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ", // Optional: Set a custom prompt
});

rl.on("close", () => {
  console.log(chalk.bold("\nWHY ARE YOU RUNNING??")); // Adding a newline before the message
  process.exit(0);
});

figlet("TASK MANAGER", async function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }

  // Display banner with color
  console.log(chalk.red(data));
  const session = await getSession();
  if (!session) {
    await auth();
  }
  await main()
  
});
