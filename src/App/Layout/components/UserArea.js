import React from "react";
import {Dropdown} from 'react-bootstrap'
export const UserArea = ({
  user,
  showProfilePopup,
  isProfilePopupOn,
  logout,
  profilePopupRef,
  lang,
  update,
  avatar
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className='bg-transparent p-0 border-0 d-flex justify-content-center align-items-center outline-0'>
        <div className="user-area d-flex justify-content-between align-items-center">
          <div className="avatar rounded-circle d-flex justify-content-center align-items-center position-relative">
              <img
                src={avatar}
                alt="User avatar"
                className="rounded-circle position-relative"
              />
          </div>
          <div className="user-info d-flex flex-column align-items-end">
            <div className="name">{user.fullName}</div>
          </div>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
