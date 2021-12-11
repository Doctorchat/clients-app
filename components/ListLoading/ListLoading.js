import PropTypes from "prop-types";
import { Children, cloneElement, memo } from "react";

const ListLoading = ({ children, itemsCount }) => {
  return Array.from(Array(itemsCount)).map((_, i) =>
    cloneElement(Children.only(children), { key: `${i}-sklt` })
  );
};

ListLoading.propTypes = {
  children: PropTypes.element,
  itemsCount: PropTypes.number,
};

ListLoading.defaultProps = {
  itemsCount: 3,
};

export default memo(ListLoading);
