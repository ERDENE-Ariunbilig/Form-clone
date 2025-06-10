import mongoose from "mongoose";


const formSchema = new mongoose.Schema({
  formId: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  questions: [],
},{ timestamps: true });

const Form = mongoose.model("Form", formSchema, "forms");
export default Form;