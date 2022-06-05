import { forwardRef, ReactNode, Ref } from "react";
import Popup from "reactjs-popup";
import { PopupActions, PopupProps } from "reactjs-popup/dist/types";

export interface AnimatedPopupProps extends Omit<PopupProps, "children"> {
  animation?: "anvil";
  children: ((close?: () => void, open?: boolean) => ReactNode) | ReactNode;
}

const modalOverlayStyle = { background: "rgba(0,0,0,0.5)" };

function AnimatedPopup(
  {
    animation = "anvil",
    modal,
    contentStyle,
    overlayStyle,
    children,
    ...props
  }: AnimatedPopupProps,
  ref: Ref<PopupActions>
) {
  return (
    <Popup
      ref={ref}
      contentStyle={Object.assign(
        {
          animation: `${animation} 0.3s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards`
        },
        contentStyle
      )}
      overlayStyle={
        modal ? Object.assign(modalOverlayStyle, overlayStyle) : overlayStyle
      }
      modal={modal}
      children={children as any}
      {...props}
    />
  );
}

const _AnimatedPopup = forwardRef(AnimatedPopup);

export { _AnimatedPopup as AnimatedPopup };
