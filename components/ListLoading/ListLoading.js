import PropTypes from "prop-types";
import { Children, cloneElement, memo } from "react";

const ListLoading = ({ children, itemsCount, className }) => {
  return (
    <div className={className}>
      {Array.from(Array(itemsCount)).map((_, i) =>
        cloneElement(Children.only(children), { key: `${i}-sklt` })
      )}
    </div>
  );
};

ListLoading.propTypes = {
  children: PropTypes.element,
  itemsCount: PropTypes.number,
  className: PropTypes.string,
};

ListLoading.defaultProps = {
  itemsCount: 3,
};

export default memo(ListLoading);
