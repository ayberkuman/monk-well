import React from "react";

const Alert = ({ type, icon, title, content, resetAlert }) => {
  return (
    <div className="app-main-alert position-fixed">
      <div className="alert-holder w-100 position-relative d-flex justify-content-start align-items-center">
        <div className="icon">
          {icon ? (
            icon
          ) : type === "warning" || type === "alert" ? (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.9825 3.5C11.3225 3.5 3.5 11.3225 3.5 21C3.5 30.6775 11.3225 38.5 20.9825 38.5C30.6425 38.5 38.5 30.6775 38.5 21C38.5 11.3225 30.66 3.5 20.9825 3.5ZM21 35C13.265 35 7 28.735 7 21C7 13.265 13.265 7 21 7C28.735 7 35 13.265 35 21C35 28.735 28.735 35 21 35ZM19.25 15.54L17.395 13.685L15.54 15.54L13.685 13.685L11.83 15.54L15.54 19.25L19.25 15.54ZM26.46 15.54L24.605 13.685L22.75 15.54L26.46 19.25L30.17 15.54L28.315 13.685L26.46 15.54ZM20.9466 23.1005C16.8697 23.1716 13.4498 25.7867 12.1123 29.3806L29.9946 29.0685C28.5325 25.5234 25.0234 23.0293 20.9466 23.1005Z"
                fill="#7B788D"
              />
            </svg>
          ) : (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.9825 3.5C11.3225 3.5 3.5 11.3225 3.5 21C3.5 30.6775 11.3225 38.5 20.9825 38.5C30.6425 38.5 38.5 30.6775 38.5 21C38.5 11.3225 30.66 3.5 20.9825 3.5ZM21 35C13.265 35 7 28.735 7 21C7 13.265 13.265 7 21 7C28.735 7 35 13.265 35 21C35 28.735 28.735 35 21 35ZM22.75 17.3951L24.605 19.2501L26.46 17.3951L28.315 19.2501L30.17 17.3951L26.46 13.6851L22.75 17.3951ZM15.54 17.3951L17.395 19.2501L19.25 17.3951L15.54 13.6851L11.83 17.3951L13.685 19.2501L15.54 17.3951ZM20.9999 30.625C25.0774 30.625 28.5424 28.07 29.9424 24.5H12.0574C13.4574 28.07 16.9224 30.625 20.9999 30.625Z"
                fill="#E4221C"
              />
            </svg>
          )}
        </div>
        <div className="content-area d-flex flex-column align-items-start">
          <div className="title">{title}</div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
        <button className="close-button position-absolute" onClick={resetAlert}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              fill="#E4221C"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
