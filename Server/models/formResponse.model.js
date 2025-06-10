import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Form", 
    required: true 
  },
  responses: [
    {
      questionId: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const FormResponse = mongoose.model("FormResponse", formResponseSchema, "formResponses");
export default FormResponse; 