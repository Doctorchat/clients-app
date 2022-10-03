import { t } from "i18next";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

export default function Truncate(props) {
  const { text, length, onReadMore } = props;

  const onReadMoreHandler = useCallback(
    (event) => {
      event.preventDefault();
      onReadMore(event);
    },
    [onReadMore]
  );

  const Content = useMemo(() => {
    if (text && text.length > length)
      return (
        <>
          {text.substr(0, length)}{" "}
          <a href="#read-more" className="link" onClick={onReadMoreHandler}>
            {t("read_more")}
          </a>
        </>
      );

    return text;
  }, [length, text, onReadMoreHandler]);

  return Content || null;
}

Truncate.propTypes = {
  text: PropTypes.string,
  length: PropTypes.number,
  onReadMore: PropTypes.func,
};
