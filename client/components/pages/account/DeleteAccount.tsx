import { useEffect, useRef, useState, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useDeleteAccount } from "operations/user";
import useOnClickOutside from "hooks/useOnClickOutside";
import modalStyles from "styles/modules/Modal.module.scss";
import inputStyles from "styles/modules/Input.module.scss";
import buttonStyles from "styles/modules/Button.module.scss";

const DeleteAccount = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <hr />
      <button className={buttonStyles.button} onClick={() => setShow(true)}>
        Delete Account
      </button>
      <Modal show={show} onClose={() => setShow(false)} />
    </>
  );
};

interface IProps {
  show: boolean;
  onClose: () => void;
}

const Modal = ({ show, onClose }: IProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [password, setPassword] = useState("");
  const { mutate, reset, isSuccess } = useDeleteAccount();

  useEffect(() => {
    reset();
    setIsBrowser(true);
  }, []);

  const handleSubmit = () => {
    mutate(password);
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
            <label>Enter password to delete account</label>
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
          Delete Account
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

export default DeleteAccount;
