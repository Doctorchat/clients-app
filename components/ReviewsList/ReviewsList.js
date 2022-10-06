import { memo } from "react";
import PropTypes from "prop-types";

import ReviewItem from "./ReviewItem";

function ReviewsList(props) {
  const { data } = props;

  const ReviewsItems = [...data].map((review) => <ReviewItem key={review.id} data={review} />);

  return <div className="reviews-list">{ReviewsItems}</div>;
}

ReviewsList.propTypes = {
  data: PropTypes.array,
};

ReviewsList.defaultProps = {
  data: [],
};

export default memo(ReviewsList);
