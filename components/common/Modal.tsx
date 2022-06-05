import { ReactNode } from "react";
import { AnimatedPopup, AnimatedPopupProps } from "./AnimatedPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface ModalProps extends Omit<AnimatedPopupProps, "modal"> {
  title: ReactNode;
}

function Modal({ title, children, ...popupProps }: ModalProps) {
  return (
    <AnimatedPopup {...popupProps} modal>
      {(close, open) => (
        <div className="bg-white rounded-md shadow-lg max-w-xl w-screen">
          <header className="flex px-10 pt-10 pb-6 justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              className="rounded-full w-6 h-6 flex justify-center items-center bg-gray-400"
              onClick={close}
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          </header>
          <div className="px-10">
            {typeof children === "function" ? children(close, open) : children}
          </div>
        </div>
      )}
    </AnimatedPopup>
  );
}

export default Modal;
