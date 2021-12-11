import PropTypes from "prop-types";
import { memo, useState } from "react";
import EmptyBox from "../EmptyBox";
import ReviewItem from "./ReviewItem";

function ReviewsList(props) {
  const { docId } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const ReviewsItems = [
    {
      id: 1,
      name: "Daniel",
      status: false,
      created: "2021-12-09T18:16:37.868Z",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    },
  ].map((review) => <ReviewItem key={review.id} data={review} />);

  return (
    <div className="reviews-list">
      <EmptyBox content="Acest doctor nu are aprecieri" />
    </div>
  );
}

ReviewsList.propTypes = {
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(ReviewsList);
