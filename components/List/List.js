import PropTypes from "prop-types";
import { memo } from "react";
import EmptyBox from "../EmptyBox";
import ListLoading from "../ListLoading";
import ListError from "./ListError";

function List(props) {
  const { empty, error, loading, loaded, skeleton, errorExtra, children } = props;

  if (error && loaded) {
    return <ListError extra={errorExtra} />;
  }

  if (loading) {
    return <ListLoading>{skeleton()}</ListLoading>;
  }

  if (empty && loaded) {
    return <EmptyBox />;
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
};

export default memo(List);
