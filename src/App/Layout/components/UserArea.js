import React, { useState } from "react";
import API from "../../../utils/API";

export const UserArea = ({
  user,
  showProfilePopup,
  isProfilePopupOn,
  logout,
  profilePopupRef,
  lang,
  update,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAvatarChange = () => {
    setIsUpdating(true);
    const bodyFormData = new FormData(document.getElementById("avatar-form"));

    API.post("Account/SendPhoto", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((r) => {
        const { status, data } = r.data;
        if (status) {
          const newUser = user;

          newUser["avatar"] = data;

          update(newUser);

          setIsUpdating(false);
        }
      })
      .catch((err) => {
        setIsUpdating(false);
      });
  };

  return (
    <div className="user-area d-flex justify-content-between align-items-center">
      <div className="user-info d-flex flex-column align-items-end">
        <div className="name">{user.fullName}</div>
      </div>
      <div className="avatar rounded-circle d-flex justify-content-center align-items-center position-relative">
        <button
          className="bg-transparent p-0 rounded-circle d-flex justify-content-center align-items-center w-100 h-100 overflow-hidden"
          onClick={showProfilePopup}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="rounded-circle position-relative"
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="position-relative"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 7.37378C15.2148 7.37378 16.2087 8.36771 16.2087 9.58251C16.2087 10.7973 15.2148 11.7913 14 11.7913C12.7852 11.7913 11.7913 10.7973 11.7913 9.58251C11.7913 8.36771 12.7852 7.37378 14 7.37378M14 17.3131C16.9818 17.3131 20.4053 18.7377 20.6262 19.5218V20.6262H7.37378V19.5329C7.59465 18.7377 11.0182 17.3131 14 17.3131M14 5.16504C11.5593 5.16504 9.58251 7.14186 9.58251 9.58251C9.58251 12.0232 11.5593 14 14 14C16.4406 14 18.4175 12.0232 18.4175 9.58251C18.4175 7.14186 16.4406 5.16504 14 5.16504V5.16504ZM14 15.1044C11.0513 15.1044 5.16504 16.5842 5.16504 19.5218V22.8349H22.8349V19.5218C22.8349 16.5842 16.9487 15.1044 14 15.1044V15.1044Z"
                fill="#7B788D"
              />
            </svg>
          )}
        </button>
        <label
          htmlFor="avatar"
          className="change-avatar position-absolute rounded-circle d-flex justify-content-center align-items-center overflow-hidden"
          data-is-disabled={isUpdating}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.17767 2.55545L9.19434 3.66656H11.4443V10.3332H2.55545V3.66656H4.80545L5.82211 2.55545H8.17767ZM8.66656 1.44434H5.33322L4.31656 2.55545H2.55545C1.94434 2.55545 1.44434 3.05545 1.44434 3.66656V10.3332C1.44434 10.9443 1.94434 11.4443 2.55545 11.4443H11.4443C12.0554 11.4443 12.5554 10.9443 12.5554 10.3332V3.66656C12.5554 3.05545 12.0554 2.55545 11.4443 2.55545H9.68322L8.66656 1.44434ZM6.99989 5.33322C7.91656 5.33322 8.66656 6.08322 8.66656 6.99989C8.66656 7.91656 7.91656 8.66656 6.99989 8.66656C6.08322 8.66656 5.33322 7.91656 5.33322 6.99989C5.33322 6.08322 6.08322 5.33322 6.99989 5.33322ZM6.99989 4.22211C5.46656 4.22211 4.22211 5.46656 4.22211 6.99989C4.22211 8.53322 5.46656 9.77767 6.99989 9.77767C8.53322 9.77767 9.77767 8.53322 9.77767 6.99989C9.77767 5.46656 8.53322 4.22211 6.99989 4.22211Z"
              fill="#F3F3F3"
            />
          </svg>
        </label>
        <form action="#!" id="avatar-form">
          <input
            type="file"
            name="file"
            className="d-none"
            id="avatar"
            onChange={handleAvatarChange}
            disabled={isUpdating}
          />
        </form>
      </div>
    </div>
  );
};
