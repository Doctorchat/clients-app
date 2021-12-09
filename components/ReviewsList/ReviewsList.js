import PropTypes from "prop-types";
import ReviewItem from "./ReviewItem";

export default function ReviewsList(props) {
  const { data } = props;

  const ReviewsItems = [];

  return (
    <div className="reviews-list">
      <ReviewItem />
    </div>
  );
}

ReviewsList.propTypes = {};

ReviewsList.defaultProps = {};
