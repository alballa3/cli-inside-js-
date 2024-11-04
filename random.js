import { faker } from "@faker-js/faker";
import fs, { mkdir } from "fs";
import path from "path";
import chalk from "chalk";
import { randomUUID } from "crypto";
import inquirer from "inquirer";
import jsw from "jsonwebtoken"

export const userData = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ip: faker.internet.ipv4(),
  address: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
  },
  phone: faker.phone.number(),
  job: {
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    department: faker.person.jobArea(),
  },
  birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
  website: faker.internet.url(),
  bio: faker.lorem.sentence(),
  profileImage: faker.image.avatar(),
  creditCard: {
    number: faker.finance.creditCardNumber(),
    expiryDate: faker.date.future(1).toISOString().slice(0, 7), // YYYY-MM
  },
  metadata: {
    lastLogin: faker.date.recent(),
    createdAt: faker.date.past(),
    isActive: faker.datatype.boolean(),
  },
};
export function MultipleFilesJson(times, data) {
  const filename = randomUUID();
  fs.mkdirSync(filename);
  if (times > 50) {
    inquirer
      .prompt([
        {
          name: "sure",
          type: "confirm",
          message: `Are You sure? ${times} files will be created`,
        },
      ])
      .then((answer) => {
        if (answer.sure == false) {
          console.log(chalk.red("Is Canalced"));
        }
      });
  }
  console.log(chalk.green(`The dict ${filename} Is Created`));
  for (let index = 1; index < times + 1; index++) {
    const app = `${filename}-${index}.json`;
    const filepath = path.join(filename, app);

    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, json, "utf8");
    console.log(
      chalk.hex("#cacaca")(
        `The file "${app}" has been created. Progress: ${Math.round(
          (index / times) * 100
        )}%`
      )
    );
    if (times == index) {
      console.log(chalk.green.bold("All The Files Are Created"));
    }
  }
}
export function generateToken(user){
  const payload={
    name:user.name,
    email:user.email
  }
  const token = jsw.sign(payload, "secret")
  return token
}
