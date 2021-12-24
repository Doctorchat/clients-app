import PropTypes from "prop-types";
import { memo } from "react";

const ListLoading = (props) => {
  const { itemsCount, className } = props;

  return (
    <div className={className}>
      {Array.from(Array(itemsCount)).map((_, i) => (
        <props.skeleton key={`${i}-sklt`} />
      ))}
    </div>
  );
};

ListLoading.propTypes = {
  skeleton: PropTypes.func,
  itemsCount: PropTypes.number,
  className: PropTypes.string,
};

ListLoading.defaultProps = {
  itemsCount: 3,
};

export default memo(ListLoading);
