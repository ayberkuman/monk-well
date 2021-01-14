import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SectionWTitle = ({
  classes,
  elProps,
  title,
  desc,
  viewAllLink,
  children,
}) => {
  return (
    <section className={`SectionWTitle ${classes}`} {...elProps}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h6 className="section-title d-flex justify-content-between align-items-center w-100">
              <span className="d-flex justify-content-start align-items-end">
                {title}{" "}
                {desc ? <span className="desc ml-2">({desc})</span> : ``}
              </span>
              {viewAllLink ? (
                <Link
                  to={viewAllLink}
                  className="view-all-link d-flex align-items-center"
                >
                  <span className="d-none d-md-block">Tümünü Gör</span>{" "}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                      fill="#F3F3F3"
                    />
                  </svg>
                </Link>
              ) : (
                ""
              )}
            </h6>
          </div>
        </div>
        <div className="row content-row">
          <div className="col col-12 content-col">{children}</div>
        </div>
      </div>
    </section>
  );
};

SectionWTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  desc: PropTypes.string,
  viewAllLink: PropTypes.string,
};

export default SectionWTitle;
