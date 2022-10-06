import PropTypes from "prop-types";

import ArrowLeftIcon from "@/icons/arrow-left.svg";
import cs from "@/utils/classNames";

import { IconBtn } from "../Button";

export default function BackTitle(props) {
  const { className, onBack, title } = props;

  return (
    <div className={cs("back-title", className, !onBack && "no-action")}>
      {onBack && <IconBtn onClick={onBack} icon={<ArrowLeftIcon />} />}
      <h3>{title}</h3>
    </div>
  );
}

BackTitle.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
