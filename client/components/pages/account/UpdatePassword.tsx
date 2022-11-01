import { useState, SyntheticEvent, useEffect } from "react";
import { useUpdatePassword } from "operations/user";
import inputStyles from "styles/modules/Input.module.scss";
import buttonStyles from "styles/modules/Button.module.scss";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { mutate, isSuccess, error, reset } = useUpdatePassword();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
      setNewPasswordError(
        "New password cannot be the same as the current password",
      );
    } else {
      setNewPasswordError("");
    }

    if (confirmPassword !== newPassword) {
      setConfirmPasswordError(
        "Confirm password has to be the same as new password",
      );
    } else {
      setConfirmPasswordError("");
    }

    // 1. Checks that current password isn't the same as new password.
    // 2. Checks that confirm password is the same as new password.
    if (currentPassword !== newPassword && confirmPassword === newPassword) {
      mutate({ currentPassword, newPassword, confirmPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      reset();
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className={inputStyles.inputGroup}>
        <div className="top-message">
          <label>Current Password</label>
          <span>{error?.formErrors?.currentPassword}</span>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
      </div>
      <div className={inputStyles.inputGroup}>
        <div className="top-message">
          <label>New Password</label>
          <span>{newPasswordError || error?.formErrors?.newPassword}</span>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </div>
      <div className={inputStyles.inputGroup}>
        <div className="top-message">
          <label>Confirm Password</label>
          <span>
            {confirmPasswordError || error?.formErrors?.confirmPassword}
          </span>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <button className={buttonStyles.button}>Update Password</button>
    </form>
  );
};

export default UpdatePassword;
