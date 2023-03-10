import { forwardRef } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

import RadioGroupContext from "./RadioGroupContext";

const RadioGroup = forwardRef((props, ref) => {
  const { name, onChange, className, children, value } = props;

  return (
    <RadioGroupContext.Provider
      value={{
        groupValue: value,
        name,
        onChange,
      }}
    >
      <div className={cs("dc-radio-group", className)} ref={ref}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = "RadioGroup";

RadioGroup.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element),
  value: PropTypes.any,
};

export default RadioGroup;
