import PropTypes from "prop-types";
import { memo } from "react";
import EmptyBox from "../EmptyBox";
import ListLoading from "../ListLoading";
import ListError from "./ListError";

function List(props) {
  const {
    empty,
    error,
    loading,
    loaded,
    skeleton,
    errorExtra,
    emptyExtra,
    loadingClassName,
    emptyClassName,
    emptyDescription,
    children,
  } = props;

  if (error && (loaded === undefined || loaded)) {
    return <ListError extra={errorExtra} />;
  }

  if (loading) {
    return <ListLoading className={loadingClassName}>{skeleton()}</ListLoading>;
  }

  if (empty && (loaded === undefined || loaded)) {
    return <EmptyBox extra={emptyExtra} className={emptyClassName} content={emptyDescription} />;
  }

  return children;
}

List.propTypes = {
  empty: PropTypes.bool,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  loadingRender: PropTypes.func,
  skeleton: PropTypes.func,
  errorExtra: PropTypes.element,
  loaded: PropTypes.bool,
  emptyClassName: PropTypes.string,
  emptyExtra: PropTypes.element,
  loadingClassName: PropTypes.string,
  emptyDescription: PropTypes.string,
  showSpinnerLoading: PropTypes.bool,
  children: PropTypes.element,
};

export default memo(List);
