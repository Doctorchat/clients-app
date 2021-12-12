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
    emptyClassName,
    children,
  } = props;

  if (error && loaded) {
    return <ListError extra={errorExtra} />;
  }

  if (loading) {
    return <ListLoading>{skeleton()}</ListLoading>;
  }

  if (empty && loaded) {
    return <EmptyBox extra={emptyExtra} className={emptyClassName} />;
  }

  return children;
}

List.propTypes = {
  empty: PropTypes.bool,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  loadingRender: PropTypes.func,
  skeleton: PropTypes.func,
  children: PropTypes.element,
  errorExtra: PropTypes.element,
  loaded: PropTypes.bool,
  emptyClassName: PropTypes.string,
  emptyExtra: PropTypes.element,
};

export default memo(List);
