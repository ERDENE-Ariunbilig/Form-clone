import express from "express";
import { sendVerificationCode, verifyCode, loginUser } from "../controller/authController.js"
import { 
  saveForm,
  getForm,
  getForms,
  submitFormResponse,
  deleteForm,
  getResponses
} from "../controller/formController.js"
import {
  allUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  
} from "../controller/userController.js";
import verifyCaptchaRouter from "./verifyCaptcha.js";

const router = express.Router();

// Use the reCAPTCHA verification routes
router.use(verifyCaptchaRouter);

// === USER ROUTES ===
router.get("/users", allUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", updateUser);

// === AUTH ROUTES ===
router.post("/auth/send-code", sendVerificationCode)
router.post("/auth/verify-code", verifyCode)
router.post("/auth/login", loginUser);


// === FORM ROUTES ===
router.post("/forms",saveForm)
router.get("/forms/:formId", getForm)
router.get("/forms", getForms)
router.delete("/forms/:formId", deleteForm)

router.post("/forms/:formId/responses", submitFormResponse)
router.get("/forms/:formId/getResponses", getResponses)

export default router;
 