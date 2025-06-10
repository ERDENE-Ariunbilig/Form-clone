import styles from './auth.module.css';                                    // required things
import { useState, useEffect } from 'react';

import Account from "./auths/account.jsx"                                   // components that calling
import CreateAccount  from "./auths/createAccount.jsx";
import Login  from "./auths/login.jsx";
import Notification from '../../components/ux/Notification/Notification';

export default function Auth({ setLogged, logged }) {
  const [login, setLogin] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const isLogged = localStorage.getItem("logged") === "true";
    if (isLogged) {
      setLogged(true); // localStorage дээр хадгалагдсан утгаар сэргээж байна
    }
  }, [setLogged]);

  if (logged) {
    return <Account setLogged={setLogged}/>;
  }

  return (
    <div className={styles["auth"]}>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: 'info' })}
        />
      )}
      {login ? (
        <CreateAccount setNotification={setNotification} />
      ) : (
        <Login setLogged={setLogged} setNotification={setNotification} />
      )}
      <button
        onClick={() => setLogin(!login)}
        className={styles["auth-button"]}
        style={{ backgroundColor: "#eee", color: "#333", marginTop: "1rem" ,width: "100%"}}
      >
        {login ? "Already have an account? Login" :  "Need an account? Register"}
      </button>
    </div>
  );
}