import PropTypes from "prop-types";

import WarnIcon from "@/icons/warning.svg";
import cs from "@/utils/classNames";

const alertIcons = {
  info: <WarnIcon />,
  error: <WarnIcon />,
  warn: <WarnIcon />,
};

export default function Alert(props) {
  const { className, type, message, extra } = props;

  return (
    <div className={cs("dc-alert", className, type)} role="alert">
      <div className="dc-alert-content">
        <span className="dc-alert-icon">{alertIcons[type]}</span>
        <span className="dc-alert-message">{message}</span>
      </div>
      {extra}
    </div>
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(["info", "error", "warn"]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  extra: PropTypes.element,
};
