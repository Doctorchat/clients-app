import PropTypes from "prop-types";
import { useMemo } from "react";

export default function Truncate(props) {
  const { text, length } = props;

  const Content = useMemo(() => {
    if (text && text.length > length) return `${text.substr(0, length)}...`;

    return text;
  }, [length, text]);

  return Content || null;
}

Truncate.propTypes = {
  text: PropTypes.string,
  length: PropTypes.number,
};
