import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function Image(props) {
  const { w, h, alt, src } = props;
  const imageRef = useRef();

  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current;

      image.setAttribute("src", image.getAttribute("data-src"));
      image.onload = () => {
        image.removeAttribute("data-src");
      };
    }
  }, [imageRef, src]);

  return (
    <img
      ref={imageRef}
      className="dc-image"
      loading="lazy"
      width={w}
      height={h}
      alt={alt}
      src={src}
      data-src={src}
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
