import { FC, SyntheticEvent, useState } from "react";
import { useRegister } from "operations/auth";
import styles from "styles/modules/Button.module.scss";
import inputStyles from "styles/modules/Input.module.scss";

const Register: FC = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john2@gmail.com");
  const [password, setPassword] = useState("test123");
  const [confirmPassword, setConfirmPassword] = useState("test123");
  const { mutate } = useRegister();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    mutate({ name, email, password, confirmPassword });
  };

  return (
    <main className="auth">
      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Name</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
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
          <div className={inputStyles.inputGroup}>
            <div className="top-message">
              <label>Confirm Password</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button className={styles.button} onClick={handleSubmit}>
            Register
          </button>
        </form>
      </div>
    </main>
  );
};

export default Register;
