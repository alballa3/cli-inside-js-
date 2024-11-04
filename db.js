import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const db = mongoose.connect("mongodb://localhost:27017/task");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  session: {
    type: String,
    required: false,
  },
  password: { type: String, required: true },
  ip: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
userSchema.pre("save", function (next) {
  const user = this;
  user.password = bcrypt.hashSync(user.password, 10);
  next();
});
export const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
});
export const Task = mongoose.model("tasks", taskSchema);
