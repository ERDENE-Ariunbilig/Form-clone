// /api/verify-captcha route
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config(); // 👈 MUST be called before using process.env


const router = express.Router();

router.post("/verify-captcha", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.SECRET_KEY,  // .env файлаас авна
          response: token
        }
      }
    );

    const result = response.data;
    console.log("reCAPTCHA backend response:", result);

    res.json({ success: result.success });
  } catch (error) {
    console.error("Captcha verification error:", error.message);
    res.status(500).json({ success: false, error: "Verification failed" });
  }
});

export default router;
