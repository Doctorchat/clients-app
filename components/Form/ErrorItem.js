import PropTypes from "prop-types";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";

export default function Error(props) {
  const { error } = props;
  const errorRef = useRef();

  return (
    <CSSTransition in={!!error?.message} nodeRef={errorRef} timeout={200} unmountOnExit>
      <span className="form-item-error" ref={errorRef}>
        {error.message}
      </span>
    </CSSTransition>
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
