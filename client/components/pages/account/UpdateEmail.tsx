import { useEffect, useRef, useState, MouseEvent, SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { useUpdateEmail, useValidateEmail } from "operations/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "types";
import Image from "next/image";
import useOnClickOutside from "hooks/useOnClickOutside";
import modalStyles from "styles/modules/Modal.module.scss";
import inputStyles from "styles/modules/Input.module.scss";
import buttonStyles from "styles/modules/Button.module.scss";

const UpdateEmail = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const { mutate, isSuccess, error, reset } = useValidateEmail();
  const currentEmail = useQuery<User>(["me"]).data?.email;

  useEffect(() => {
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [currentEmail]);

  // If email is valid show modal
  useEffect(() => {
    isSuccess && setShow(true);
    reset();
  }, [isSuccess]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email !== currentEmail) {
      mutate(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className={inputStyles.inputGroup}>
        <div className="top-message">
          <label>Email</label>
          <span>{error?.formErrors?.email}</span>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Image
            style={{ cursor: "pointer" }}
            src="/reset-update-icon.svg"
            width={20}
            height={20}
            onClick={() => setEmail(currentEmail || "")}
          />
        </div>
      </div>
      <button className={buttonStyles.button}>Update Email</button>
      <Modal
        email={email}
        currentEmail={currentEmail}
        show={show}
        onClose={() => setShow(false)}
      />
    </form>
  );
};

interface IProps {
  email: string;
  currentEmail?: string;
  show: boolean;
  onClose: () => void;
}

const Modal = ({ email, currentEmail, show, onClose }: IProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [password, setPassword] = useState("");
  const { mutate, error, reset, isSuccess } = useUpdateEmail();

  useEffect(() => {
    reset();
    setIsBrowser(true);
  }, []);

  const handleSubmit = () => {
    mutate({
      email,
      password,
    });
  };

  const handleCloseClick = (e: MouseEvent<HTMLDivElement> | Event) => {
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, handleCloseClick);

  const modalContent = show ? (
    <div className="backdrop">
      <div
        className={modalStyles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={ref}
      >
        <div className={inputStyles.inputGroupBorder}>
          <div className="top-message">
            <label>Enter password to update email</label>
            <span>{error?.formErrors?.password}</span>
          </div>
          <div className="input-container">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
        </div>
        <button className={buttonStyles.button} onClick={handleSubmit}>
          Update Email
        </button>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return createPortal(modalContent, document.getElementById("modal-root")!);
  } else {
    return null;
  }
};

export default UpdateEmail;
