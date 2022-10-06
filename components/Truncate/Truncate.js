import { useCallback, useMemo } from "react";
import { t } from "i18next";
import PropTypes from "prop-types";

export default function Truncate(props) {
  const { text, length, onReadMore } = props;

  const readMoreText = t("read_more");

  const onReadMoreHandler = useCallback(
    (event) => {
      event.preventDefault();
      onReadMore(event);
    },
    [onReadMore]
  );

  const Content = useMemo(() => {
    if (text && text.length + readMoreText.length > length)
      return (
        <>
          {text.substr(0, length - readMoreText.length)}
          {"... "}
          <a href="#read-more" className="link" onClick={onReadMoreHandler}>
            {readMoreText}
          </a>
        </>
      );

    return text;
  }, [length, text, readMoreText, onReadMoreHandler]);

  return Content || null;
}

Truncate.propTypes = {
  text: PropTypes.string,
  length: PropTypes.number,
  onReadMore: PropTypes.func,
};
