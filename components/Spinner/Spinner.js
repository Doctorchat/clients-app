import PropTypes from "prop-types";
import { forwardRef, memo } from "react";
import SpinnerIcon from "@/icons/spinner.svg";
import cs from "@/utils/classNames";

const Spinner = forwardRef((props, ref) => (
  <span className={cs("dc-spinner", props.className)} ref={ref}>
    <SpinnerIcon />
  </span>
));

Spinner.propTypes = {
  className: PropTypes.string,
};

Spinner.displayName = "Spinner"

export default memo(Spinner);
