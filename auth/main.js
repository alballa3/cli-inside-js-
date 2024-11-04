import inquirer from "inquirer";
import axios from "axios";
import chalk from "chalk";
import { exec } from "child_process";
// const { spawn, exec, fork } = require('child_process');
import { spawn } from "child_process";

export function reopenCLI() {
  console.clear()
  const cli = spawn("node", ["app.js"], {
    stdio: "inherit", // This option allows the new process to inherit stdio from the parent
    shell: true, // Use shell to interpret command
  });

  cli.on("close", (code) => {
    console.log(`CLI process exited with code ${code}`);
  });
}

// Example usage after a successful login

export async function auth() {
  // Run prompt after banner is displayed
  const type = await inquirer.prompt([
    {
      type: "list",
      choices: ["login", "register"].reverse(),
      name: "authType",
      message: "Welcome! Please select an option to get started:",
    },
  ]);
  if (type.authType == "register") {
    const userInput = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter Your Name:",
        required: true,
        validate: (input) => {
          return input.length > 0 || "Please enter a valid name.";
        },
      },
      {
        type: "input",
        name: "email",
        message: "Enter Your Email",
        required: true,
        validate: (input) => {
          // Regular expression to validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return (
            emailRegex.test(input) || "Please enter a valid email address."
          );
        },
      },
      {
        type: "password",
        name: "password",
        message: "Enter Your Password:",
        required: true,
        validate: (input) => {
          return (
            input.length >= 6 || "Password must be at least 6 characters long."
          );
        },
      },
    ]);
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        console.log(chalk.red("Registration Failed"));
        return;
      }

      const data = await response.json();
      console.log(chalk.green.bold("Run the app again!"));
      reopenCLI()
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    while (true) {
      const userInput = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter Your Email",
          required: true,
          validate: (input) => {
            // Regular expression to validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return (
              emailRegex.test(input) || "Please enter a valid email address."
            );
          },
        },
        {
          type: "password",
          name: "password",
          message: "Enter Your Password:",
          required: true,
          validate: (input) => {
            return (
              input.length >= 6 ||
              "Password must be at least 6 characters long."
            );
          },
        },
      ]);

      const respond = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      const json = await respond.json();
      if (json.message == "Invalid credentials") {
        console.log(chalk.red(json.message));
        continue;
      }
      console.log(chalk.green("Login successful!"));

      exec(`node app`, (error) => {
        if (error) {
          console.error(`Error restarting app: ${error.message}`);
        }
      });

      reopenCLI();
      // Exit the current process
      break; // Exit loop if login is successful
    }
  }
}
