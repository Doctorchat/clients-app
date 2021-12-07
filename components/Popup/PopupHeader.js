import PropTypes from "prop-types";
import { useContext } from "react";
import { IconBtn } from "../Button";
import PopupContext from "./PopupContext";
import cs from "@/utils/classNames";
import TimesIcon from "@/icons/times.svg";

export default function PopupHeader(props) {
  const { className, title } = props;
  const { closePopup } = useContext(PopupContext);

  return (
    <div className={cs("popup-header", className)}>
      {typeof title === "string" ? <h3>{title}</h3> : title}
      <IconBtn className="popup-close-btn" icon={<TimesIcon />} onClick={closePopup} />
    </div>
  );
}

PopupHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
