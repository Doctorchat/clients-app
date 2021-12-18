import PropTypes from "prop-types";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Spinner from ".";

export default function ContainerLoading(props) {
  const { loadingText, loading } = props;
  const spinnerRef = useRef();

  return (
    <CSSTransition in={loading} timeout={200} nodeRef={spinnerRef} unmountOnExit>
      <div className="list-container__spinner" ref={spinnerRef}>
        <Spinner />
        <span className="list-container__spinner-text">{loadingText}</span>
      </div>
    </CSSTransition>
  );
}

ContainerLoading.propTypes = {
  loadingText: PropTypes.string,
  loading: PropTypes.bool,
};

ContainerLoading.defaultProps = {
  loadingText: "Se incarcă",
};
