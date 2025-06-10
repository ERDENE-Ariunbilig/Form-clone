import { useState } from "react";
import "./css/forgotPassword.css";
import ReCAPTCHA from "react-google-recaptcha";
import { sendVerificationCode, verifyCode, verifyCaptcha, updateUser } from "../../../api";

export default function ForgotPassword({ setNotification }) {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null); // ID-г код баталгаажуулсны дараа авах боломжтой

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setNotification({ message: "И-мэйл буруу байна", type: "error" });
      return;
    }

    if (!captchaToken) {
      setNotification({ message: "reCAPTCHA-г баталгаажуулна уу", type: "error" });
      return;
    }

    try {
      const verifyRes = await verifyCaptcha(captchaToken);
      if (!verifyRes.data.success) {
        setNotification({ message: "reCAPTCHA шалгалт амжилтгүй боллоо", type: "error" });
        return;
      }
    } catch (err) {
      setNotification({ message: "reCAPTCHA шалгалт хийхэд алдаа гарлаа", type: "error" });
      return;
    }

    try {
      const res = await sendVerificationCode(email);
      if (res.data.success) {
        setCodeSent(true);
        setNotification({ message: "Код амжилттай илгээгдлээ", type: "success" });
      } else {
        setNotification({ message: "Код илгээхэд алдаа гарлаа", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Сервертэй холбогдоход алдаа гарлаа", type: "error" });
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifyCode(email, code);
      if (res.data.success) {
        setNotification({ message: "Код зөв байна. Одоо нууц үгээ шинэчилнэ үү.", type: "success" });
        setResetPassword(true);
        setUserId(res.data.userId); // userId-г серверээс авах ёстой (API-д нэмэх)
      } else {
        setNotification({ message: "Код буруу байна", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Сервертэй холбогдоход алдаа гарлаа", type: "error" });
    }
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setNotification({ message: "Бүх талбарыг бөглөнө үү", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ message: "Нууц үг таарахгүй байна", type: "error" });
      return;
    }

    try {
      const res = await updateUser(userId, { newPassword });
      if (res.data.success) {
        setNotification({ message: "Нууц үг амжилттай солигдлоо", type: "success" });
        // Хүсвэл энд resetPassword-г false болгох, бүх state-ыг цэвэрлэх
      } else {
        setNotification({ message: "Алдаа гарлаа", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Сервертэй холбогдоход алдаа гарлаа", type: "error" });
    }
  };

  return (
    <div className="reset-container">
      {!resetPassword ? (
        !codeSent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="И-мэйл хаяг"
              className="reset-input"
            />
            <div className="captcha-box">
              <ReCAPTCHA sitekey="6LeBF1QrAAAAAOZmbqeQ-HynhQHy7yGzRKeFJTf1" onChange={handleCaptchaChange} />
            </div>
            <button onClick={handleSendCode} className="send-code-button">Код илгээх</button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6 оронтой код оруулна уу"
              className="reset-input"
            />
            <button onClick={handleVerifyCode} className="verify-code-button">Код шалгах</button>
          </>
        )
      ) : (
        <>
          <h1 className="reset-title">Нууц үг шинэчлэх</h1>
          <input
            type="password"
            placeholder="Шинэ нууц үг"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="reset-input"
          />
          <input
            type="password"
            placeholder="Нууц үгээ дахин оруулна уу"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="reset-input"
          />
          <button onClick={handleReset} className="reset-button">Нууц үг солих</button>
        </>
      )}
    </div>
  );
}
