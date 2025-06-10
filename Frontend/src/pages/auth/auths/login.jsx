import { verifyUser, verifyCaptcha } from "../../../api.js";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./css/login.css";

import Forgotpassword from "./forgotpassword.jsx";

export default function Login({ setLogged, setNotification }) {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [captchaToken, setCaptchaToken] = useState(null);

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    function handleCaptchaChange(token) {
        console.log("reCAPTCHA token received:", token ? "token exists" : "token is null");
        setCaptchaToken(token);
    }


    async function handleSubmit(e) {
        e.preventDefault();

        if (!captchaToken) {
            setNotification({
                message: "reCAPTCHA-г баталгаажуулна уу",
                type: "error"
            });
            return;
        }

        try {
            // Verify captcha first
            console.log("Verifying captcha with token");
            const isValid = await verifyCaptcha(captchaToken);
            console.log("Captcha validation result:", isValid);

            if (!isValid) {
                setNotification({
                    message: "reCAPTCHA баталгаажуулалт амжилтгүй боллоо",
                    type: "error"
                });
                return;
            }

            // If captcha is valid, proceed with login
            let response = await verifyUser(user);
            console.log(response);

            if (response) {
                localStorage.setItem("User", JSON.stringify({
                    id: response.data.id,
                    name: response.data.name
                }));
                setLogged(true);
                localStorage.setItem("logged", "true");
                setNotification({
                    message: "Амжилттай нэвтэрлээ",
                    type: "success"
                });
            } else {
                setNotification({
                    message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Login error:", error.message);
            setNotification({
                message: "Серверт холбогдоход алдаа гарлаа",
                type: "error"
            });
        }
    }

    return (
        <div className="login-container">
            {!forgotPassword && (
                <form onSubmit={handleSubmit} className="login-form">
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
                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setForgotPassword(true)}
                        className="forgot-password-button"
                    >
                        Forgot Password?
                    </button>
                </form>
            )}
            {forgotPassword && (
                <Forgotpassword setNotification={setNotification} />
            )}
        </div>
    );
}
