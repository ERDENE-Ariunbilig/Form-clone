import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  forms : [{type: mongoose.Schema.Types.ObjectId, ref: 'Form' }]
});

const User = mongoose.model("User", userSchema, "users");
export default User;
