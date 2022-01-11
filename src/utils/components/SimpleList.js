import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../App/appActions";
import { CSSTransition } from "react-transition-group";
import { Loader } from "./Loader";
import InfiniteScroll from "react-infinite-scroll-component";

export const SimpleList = ({
  translate,
  title,
  extra,
  listItems,
  id,
  options,
  dataLength,
  hasMore,
  loadMore,
  isLoading,
  addToCategory,
  clearList,
  showDragBox,
  handleDrag,
  isProcessingDrag,
  isTargetDropbox,
  ...rest
}) => {
  const [isOptionsActive, setIsOptionsActive] = useState(false);
  const dispatch = useDispatch();
  const optionsRef = useRef();
  const optionsButtonRef = useRef();
  const optionsOverlayRef = useRef();
  const dropboxNodeRef = useRef();

  useEffect(() => {
    if (isOptionsActive) window.onclick = () => setIsOptionsActive(false);
    return () => {
      window.onclick = () => {};
    };
  }, [isOptionsActive]);

  const toggleOptions = (e) => {
    if (e) e.stopPropagation();

    if (
      e.target === optionsButtonRef.current ||
      e.target === optionsOverlayRef.current
    ) {
      dispatch(toggleModal(!isOptionsActive));
      setTimeout(() => setIsOptionsActive(!isOptionsActive), 100);
    }
  };

  return (
    <div
      className="SimpleList d-flex flex-column"
      id={id}
      data-options-active={isOptionsActive}
      onDrop={addToCategory}
      onDragOver={(e) => e.preventDefault()}
    >
      {"hasOptions" in rest && (
        <CSSTransition
          in={isOptionsActive}
          timeout={300}
          unmountOnExit
          nodeRef={optionsRef}
        >
          <div
            className="options-overlay position-fixed"
            ref={optionsOverlayRef}
            onClick={toggleOptions}
          />
        </CSSTransition>
      )}
      <div className="list-title d-flex justify-content-between align-items-center position-relative">
        <h4 className="title m-0">{title}</h4>
        {clearList ? (
          <button onClick={() => clearList()}>
            <h4 className="title m-0"> All List</h4>
          </button>
        ) : null}

        {"hasOptions" in rest && (
          <button
            className="options-button rounded-circle d-flex justify-content-center align-items-center"
            onClick={toggleOptions}
            ref={optionsButtonRef}
          >
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="option-down-icon"
            >
              <path
                d="M4 4L7 1"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4L1 1"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <CSSTransition
              in={isOptionsActive}
              timeout={300}
              unmountOnExit
              nodeRef={optionsRef}
              classNames="options-holder"
            >
              <div className="options-holder position-absolute">
                <ul className="options-list">
                  {options.map((data, i) => (
                    <li
                      key={i}
                      className="options-list-item d-flex position-relative justify-content-start align-items-center"
                    >
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
            </CSSTransition>
          </button>
        )}
      </div>
      {extra && <div className="extra">{extra}</div>}
      <div
        className="list-holder position-relative"
        id={`ListHolder-${id}`}
        style={{ minHeight: showDragBox ? 100 : 20 }}
      >
        {"isDraggable" in rest && (
          <CSSTransition
            in={
              (showDragBox && !isProcessingDrag) ||
              (showDragBox && isProcessingDrag && isTargetDropbox)
            }
            timeout={300}
            nodeRef={dropboxNodeRef}
            unmountOnExit
            classNames="dragBox"
          >
            <div
              className="dragBox position-absolute d-flex justify-content-center align-items-center text-center"
              ref={dropboxNodeRef}
            >
              {isProcessingDrag && isTargetDropbox ? (
                <Loader />
              ) : (
                `Kategoriye eklemek için buraya taşıyın.`
              )}
            </div>
          </CSSTransition>
        )}
        {isLoading ? (
          <div className="d-flex w-100 justify-content-center">
            <Loader />
          </div>
        ) : !isLoading && listItems.length === 0 ? (
          <div className="d-flex w-100 justify-content-center pt-2 pb-3">
            {translate("calendar.no_appointment")}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={dataLength}
            next={loadMore}
            hasMore={hasMore}
            loader={<Loader />}
            className="d-flex flex-column align-items-start w-100"
            scrollableTarget={`ListHolder-${id}`}
            style={{
              overflowY: "auto",
              overflowX: "visible",
              padding: "0 15px",
            }}
          >
            {listItems.map((data, index) => (
              <div
                draggable
                key={index}
                className="list-item d-flex justify-content-between align-items-center position-relative w-100"
                onDragEnd={"isDraggable" in rest ? handleDrag : () => {}}
                onDragStart={
                  "isDraggable" in rest ? (e) => handleDrag(e, index) : () => {}
                }
              >
                <div className="inner">{data}</div>
                <div className="icon">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.581339 5.12985L7.03303 5.12985L4.50551 7.9091C4.27972 8.15825 4.27972 8.5643 4.50551 8.81344C4.73167 9.06219 5.10191 9.06219 5.32734 8.81344L8.83083 4.96069C8.94517 4.83415 9.00072 4.667 8.99857 4.50024C8.99857 4.4963 9 4.49354 9 4.49039V4.4896C9 4.48526 8.99713 4.47974 8.99713 4.47462C8.99498 4.39656 8.98208 4.3189 8.95484 4.24519C8.93764 4.20064 8.90825 4.16477 8.88208 4.12495C8.8638 4.09696 8.85341 4.06385 8.83083 4.03901L5.32734 0.186267C5.10191 -0.062089 4.73166 -0.062089 4.50551 0.186267C4.27972 0.435419 4.27972 0.84225 4.50551 1.09061L7.01513 3.85099L0.581336 3.85099C0.261275 3.85099 0 4.13916 0 4.48962C0 4.84166 0.261284 5.12984 0.581336 5.12984"
                      fill="#7273CD"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

SimpleList.defaultProps = {
  extra: null,
  listItems: [],
  id: "",
  options: [],
  dataLength: 0,
  loadMore: () => {},
  hasMore: false,
};

SimpleList.propTypes = {
  title: PropTypes.string.isRequired,
  extra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  listItems: PropTypes.array,
  hasOptions: PropTypes.bool,
  options: PropTypes.array,
  dataLength: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};
