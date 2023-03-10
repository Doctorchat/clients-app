import PropTypes from "prop-types";

import DislikeIcon from "@/icons/dislike.svg";
import LikeIcon from "@/icons/like.svg";
import cs from "@/utils/classNames";
import date from "@/utils/date";

import Image from "../Image";






export default function ReviewItem(props) {
  const {
    data: { created, name, content, avatar, like },
  } = props;

  return (
    <div className="review-item">
      <div className="review-avatar">
        <div className="dialog-avatar">
          <Image src={avatar} alt={name} w="58" h="58" />
        </div>
        <span className={cs("status", !like && "negative")}>{like ? <LikeIcon /> : <DislikeIcon />}</span>
      </div>
      <div className="review-content">
        <div className="review-top">
          <span className="name">{name}</span>
          <span className="date">{date(created).dynamic()}</span>
        </div>
        <div className="review-bottom">
          <p className="mb-0">{content}</p>
        </div>
      </div>
    </div>
  );
}

ReviewItem.propTypes = {
  data: PropTypes.shape({
    created: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    avatar: PropTypes.string,
    like: PropTypes.bool,
  }),
};
