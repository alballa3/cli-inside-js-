import inquirer from "inquirer";
import { settings} from "./settings.js";
export  async function main() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "What do you want to do?",
      choices: ["settings","talk to ai"],
    },
  ]);

  switch (answer.answer) {
    case "talk to ai":
      await ai
      break;
    case "settings":
      await settings();
      break;
  }
}
