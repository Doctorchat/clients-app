import PropTypes from "prop-types";
import { useContext, useMemo } from "react";
import { IconBtn } from "../Button";
import Confirm from "../Confirm";
import PopupContext from "./PopupContext";
import cs from "@/utils/classNames";
import TimesIcon from "@/icons/times.svg";

export default function PopupHeader(props) {
  const { className, title } = props;
  const { closePopup, confirmationClose } = useContext(PopupContext);

  const CloseBtn = useMemo(() => {
    if (confirmationClose && !confirmationClose.disabled) {
      return (
        <Confirm onConfirm={closePopup} content={confirmationClose.content}>
          <IconBtn className="popup-close-btn" icon={<TimesIcon />} />
        </Confirm>
      );
    }

    return <IconBtn className="popup-close-btn" icon={<TimesIcon />} onClick={closePopup} />;
  }, [closePopup, confirmationClose]);

  return (
    <div className={cs("popup-header", className)}>
      {typeof title === "string" ? <h3 className="mb-0">{title}</h3> : title}
      {CloseBtn}
    </div>
  );
}

PopupHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
