import PropTypes from "prop-types";

export default function Image(props) {
  const { w, h, alt, src } = props;

  return <img width={w} height={h} alt={alt} src={src} />;
}

Image.propTypes = {
  w: PropTypes.string,
  h: PropTypes.string,
  alt: PropTypes.string,
  src: PropTypes.string,
};
