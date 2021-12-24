import PropTypes from "prop-types";
import { memo } from "react";
import EmptyBox from "../EmptyBox";
import ListLoading from "../ListLoading";
import ListError from "./ListError";

function List(props) {
  const { loaded, loadingConfig, errorConfig, emptyConfig, children } = props;

  if (!errorConfig.disabled) {
    if (errorConfig.status && (loaded === undefined || loaded)) {
      return <ListError {...errorConfig} />;
    }
  }

  if (!loadingConfig.disabled) {
    if (loadingConfig.status) {
      return <ListLoading {...loadingConfig} />;
    }
  }

  if (!emptyConfig.disabled) {
    if (emptyConfig.status && (loaded === undefined || loaded)) {
      return <EmptyBox {...emptyConfig} />;
    }
  }

  return children;
}

List.propTypes = {
  loaded: PropTypes.bool,
  children: PropTypes.element,
  loadingConfig: PropTypes.shape({
    disabled: PropTypes.bool,
    status: PropTypes.bool,
    skeleton: PropTypes.func,
    className: PropTypes.string,
  }),
  errorConfig: PropTypes.shape({
    disabled: PropTypes.bool,
    status: PropTypes.bool,
    extra: PropTypes.element,
  }),
  emptyConfig: PropTypes.shape({
    disabled: PropTypes.bool,
    status: PropTypes.bool,
    extra: PropTypes.element,
    className: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default memo(List);
