import PropTypes from "prop-types";
import HeartIcon from "@/icons/heart.svg";
import LikeIcon from "@/icons/like.svg";
import StarIcon from "@/icons/star.svg";
import ClockIcon from "@/icons/clock.svg";
import HospitalIcon from "@/icons/hospital.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";
import ReviewsList from "../ReviewsList";

export default function DocInfoReviews(props) {
  const { docId } = props;

  return (
    <div className="doc-info-tab-content doc-info-reviews">
      <ReviewsList />
    </div>
  );
}

DocInfoReviews.propTypes = {};

DocInfoReviews.defaultProps = {};
