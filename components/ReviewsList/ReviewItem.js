import PropTypes from "prop-types";

export default function ReviewItem(props) {
  const { data } = props;

  return (
    <div className="review-item">
      <div className="review-caption">
        <h4 className="review-name">Daniel</h4>
        <span className="review-date">Acum 2 zile</span>
      </div>
      <p className="review-content">Multumesc pentru clarificari si operativitatea raspunsului !</p>
    </div>
  );
}

ReviewItem.propTypes = {};

ReviewItem.defaultProps = {};
