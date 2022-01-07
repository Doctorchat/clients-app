import PropTypes from "prop-types";

export default function Image(props) {
  const { w, h, alt, src } = props;

  return (
    <img
      className="dc-image"
      loading="lazy"
      width={w}
      height={h}
      alt={alt}
      src={src}
      style={{
        "--img-w": w + "px",
        "--img-h": h + "px",
      }}
    />
  );
}

Image.propTypes = {
  w: PropTypes.string,
  h: PropTypes.string,
  alt: PropTypes.string,
  src: PropTypes.string,
};
