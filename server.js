import fs from "fs";
import z from "zod";
import express from "express";
import { Task, User } from "./db.js";
import { createSession } from "./auth/session.js";
import { generateToken } from "./random.js";
import bcrypt, { compareSync } from "bcrypt";

const app = express();
const port = 3000;
const userSchema = z.object({
  name: z.string().min(1, "Name cannot be empty."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});
const taskSchema = z.object({
  userId: z.string().nonempty("User ID is required."),
  description: z.string().nonempty("Description is required."),
  name: z.string().nonempty("Name is required."),
});
app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidPassword = compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(user);
  await user.updateOne({
    session: token,
  });
  await createSession(  token );

  return res.status(200).json({ message: "Login successful", user });
});
app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;
  let ip = req.ip;

  // Check for IPv6 localhost address
  if (ip === "::1") {
    ip = "127.0.0.1"; // Fallback to IPv4 localhost
  }
  const data = { name, password, email, ip, session: "" };
  const Vaildition = userSchema.safeParse({ name, password, email });
  if (!Vaildition.success) {
    return res.status(406).json({
      errors: Vaildition.error.flatten().fieldErrors,
    });
  }
  try {
    const token = generateToken(data);
    await createSession({ token: token });
    data.session = token;
    const user = new User(data);
    await user.save();
    return res.status(201).json({
      message: "The User Is Created",
      user: user,
    });
  } catch (error) {
    res.json(error);
  }
});
app.listen(port, () => {
  console.log(`The Server Is runing on port ${port}`);
  console.log(`The Server is running on http://localhost:${port}`);
});
app.get("/task",async (req,res)=>{
  const { userId}=req.body
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    const tasks = await Task.find({ userId }).populate("userId","name"); // Await the query result
    return res.status(200).json(tasks); // Send the tasks in the response
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching tasks.",
      error: error.message,
    });
  }
})
app.post("/task", async (req, res) => {
  const { userId, description, name } = req.body;
  const Vaildition=taskSchema.safeParse({
    userId,description,name
  })
  if(! Vaildition.success){
    return res.status(406).json({
      message:"Vaildtion Error",
      errors:Vaildition.error.flatten().fieldErrors
    })
  }
  const create = new Task({ userId, description, name });
  await create.save()
  return res.json(create)
});
