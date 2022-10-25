import { FC, SyntheticEvent, useState } from "react";
import { useLogin } from "operations/auth";
import styles from "styles/modules/Button.module.scss";
import inputStyles from "styles/modules/Input.module.scss";

const Login: FC = () => {
  const [email, setEmail] = useState("sam@gmail.com");
  const [password, setPassword] = useState("test123");
  const { mutate } = useLogin();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <main className="auth">
      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Email</label>
            </div>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Password</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button className={styles.button} onClick={handleSubmit}>
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
