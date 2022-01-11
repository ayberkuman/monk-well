import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";

export const MonkButton = ({
  type,
  action,
  onClick,
  className,
  children,
  isLink,
  navLink,
  exact,
  ...rest
}) => {
  return !isLink ? (
    <button
      className={`MonkButton ${className}`}
      data-type={type}
      type={action}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  ) : navLink ? (
    <NavLink
      to={action}
      className={`MonkButton ${className}`}
      data-type={type}
      onClick={onClick}
      exact={exact}
    >
      {children}
    </NavLink>
  ) : (
    <Link
      to={action}
      className={`MonkButton ${className}`}
      data-type={type}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

MonkButton.defaultProps = {
  type: "pri",
  action: "button",
  onClick: () => {},
  className: "",
  isLink: false,
  navLink: false,
  exact: true,
};

MonkButton.propTypes = {
  type: PropTypes.oneOf(["pri", "sec", "alt", "pri-empty", "sec-empty"]),
  action: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  isLink: PropTypes.bool,
  navLink: PropTypes.bool,
  exact: PropTypes.bool,
};
