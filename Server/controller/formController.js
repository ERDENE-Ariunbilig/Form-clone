import mongoose from "mongoose";
import User from "../models/user.model.js";
import Form from "../models/form.model.js";
import FormResponse from "../models/formResponse.model.js";

const saveForm = async (req, res) => {
  const { createdBy, formId, ...restFormData } = req.body;
  try {
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const generatedFormId = formId || new mongoose.Types.ObjectId().toString();

    const newForm = new Form({
      createdBy,
      formId: generatedFormId,
      ...restFormData,
    });

    await newForm.save();

    user.forms.push(newForm._id);
    await user.save();

    res.status(200).json({ message: "Form saved", formId: newForm._id });
  } catch (error) {
    console.error("Form save error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getForm = async (req, res) => {
  const { formId } = req.params;

  try {
    // formId нь actual MongoDB _id байж магадгүй
    let form = await Form.findOne({ formId });

    if (!form && mongoose.Types.ObjectId.isValid(formId)) {
      form = await Form.findById(formId); // fallback
    }

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getForms = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const forms = await Form.find({ createdBy: userId });

    res.json({ forms });
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: error.message });
  }
};

const submitFormResponse = async (req, res) => {
  const { formId } = req.params;
  const { responses } = req.body;

  console.log("response", responses)
  
  try {
    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Create the response
    const newResponse = new FormResponse({
      formId: form._id,
      responses: responses,
      submittedAt: new Date()
    });

    await newResponse.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Form response submitted successfully",
      responseId: newResponse._id
    });
  } catch (error) {
    console.error("Form response submission error:", error);
    res.status(500).json({ error: "Failed to submit form response" });
  }
};
const deleteForm = async (req, res) => {
  const { formId } = req.params;

  try {
    const deleted = await Form.findByIdAndDelete(formId);

    if (!deleted) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
};



const getResponses= async (req, res) => {
  const { formId } = req.params;

  try {
    let formResponse = await FormResponse.find({ formId });
    if (!formResponse) {
      return res.status(404).json({ error: "Form responses not found" });
    }
    res.status(200).json(formResponse);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: error.message });
  }
}

export {
  saveForm,
  getForm,
  getForms,
  submitFormResponse,
  deleteForm,
  getResponses
};


