// Libraries
import React from "react";

// Components
import FlexColumn from "./FlexColumn";

const Modal = (props) => {

  const align = props.align || "center"
  const background = props.background || "kit-bg-smoke-light";
  const disableCloseButton = props.disableCloseButton || false;
  const zIndex = props.zIndex || 2;

    return (
      <FlexColumn
        align={align}
        className={
          "kit-no-user " +
          (background) + " " +
          (props.className || "")
        }
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: "0",
          left: "0",
          zIndex: zIndex,
          ...props.style
        }}
      >
        {props.children}
        {!disableCloseButton &&
        <button
          className="btn btn-dark"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: Number(zIndex) + 1,
          }}
          onClick={() => props.onClose()}
        >
          <svg
            className="kit-icon-light kit-svg-white"
            height="2rem" 
            width="2rem" 
            viewBox="4 4 8 8"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>}
      </FlexColumn>
    );
}
export default Modal;