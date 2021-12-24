import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

export default function Error(props) {
  const { error } = props;
  const [errorHeight, setErrorHeight] = useState(0);
  const [animationStates, setAnimationStates] = useState({
    placeholder: false,
    error: false,
  });
  const errorRef = useRef();
  const animationPlaceholder = useRef();

  useEffect(() => {
    if (error?.message) {
      setAnimationStates((prevState) => ({ ...prevState, placeholder: true }));
    } else {
      setAnimationStates({ error: false, placeholder: false });
    }
  }, [error]);

  useEffect(() => {
    setErrorHeight(errorRef.current?.offsetHeight || 17);
  }, [errorRef]);

  const onPlaceholderEntered = () => {
    setAnimationStates((prevState) => ({ ...prevState, error: true }));
  };

  return (
    <>
      <CSSTransition
        in={animationStates.placeholder}
        timeout={200}
        nodeRef={animationPlaceholder}
        unmountOnExit
        onEntered={onPlaceholderEntered}
      >
        <div
          className="form-item-error-placeholder"
          ref={animationPlaceholder}
          style={{ "--err-height": errorHeight + "px" }}
        />
      </CSSTransition>
      <CSSTransition in={animationStates.error} nodeRef={errorRef} timeout={200} unmountOnExit>
        <span className="form-item-error" ref={errorRef}>
          {error.message}
        </span>
      </CSSTransition>
    </>
  );
}

Error.propTypes = {
  error: PropTypes.object,
};

Error.defaultProps = {
  error: {
    message: null,
  },
};
