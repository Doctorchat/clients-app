import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Image from "../Image";
import emptyIcon from "@/imgs/empty-folder.png";
import cs from "@/utils/classNames";

export default function EmptyBox(props) {
  const { t } = useTranslation();
  const { className, title = t("no_data"), content = t("conversation_list_empty"), extra } = props;

  return (
    <div className={cs("empty-box", className)}>
      <div className="empty-box-image">
        <Image alt={t("no_data")} w="64" h="64" src={emptyIcon.src} />
      </div>
      <div className="empty-box-content">
        <h4 className="empty-box-title">{title}</h4>
        <p className="empty-box-descrp">{content}</p>
      </div>
      {extra}
    </div>
  );
}

EmptyBox.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  extra: PropTypes.element,
};
