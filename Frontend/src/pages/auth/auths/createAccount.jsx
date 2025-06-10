import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import "./css/createAccount.css"

import { createUser, verifyCaptcha } from "../../../api.js" // аль хэдийн import хийгдсэн

export default function CreateAccount({ setNotification }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [captchaToken, setCaptchaToken] = useState(null)
  const navigate = useNavigate()

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function handleCaptchaChange(token) {
    console.log("reCAPTCHA token received:", token ? "token exists" : "token is null");
    setCaptchaToken(token)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!captchaToken) {
      setNotification({ message: "reCAPTCHA-г баталгаажуулна уу", type: "error" })
      return
    }

    const isValid = await verifyCaptcha(captchaToken)
    if (!isValid) {
      setNotification({ message: "reCAPTCHA баталгаажуулалт амжилтгүй боллоо", type: "error" })
      return
    }

    try {
      const response = await createUser(user)
      if (response && response._id) {
        setNotification({ message: "Бүртгэл амжилттай үүслээ", type: "success" })
        navigate("/create", { state: { userId: response._id } })
      } else {
        setNotification({ message: "Бүртгэл үүсгэхэд алдаа гарлаа", type: "error" })
      }
    } catch (error) {
      console.error("Account creation error:", error.message)
      setNotification({ message: "Бүртгэл үүсгэх үед алдаа гарлаа", type: "error" })
    }
  }

  return (
<div className="register-container">
  <form onSubmit={handleSubmit} className="register-form">
    <input
      placeholder="Name"
      onChange={handleChange}
      name="name"
      required
      maxLength={20}
      className="input-field"
    />
    <input
      placeholder="Email"
      onChange={handleChange}
      name="email"
      required
      maxLength={40}
      className="input-field"
    />
    <input
      placeholder="Password"
      onChange={handleChange}
      name="password"
      type="password"
      required
      maxLength={20}
      className="input-field"
    />
    <div className="captcha-box">
      <ReCAPTCHA
        sitekey="6LeBF1QrAAAAAOZmbqeQ-HynhQHy7yGzRKeFJTf1"
        onChange={handleCaptchaChange}
      />
    </div>
    <button type="submit" className="register-button">
      Create Account
    </button>
  </form>
</div>

  )
}
