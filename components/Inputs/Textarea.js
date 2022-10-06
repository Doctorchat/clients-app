import { forwardRef,useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

const sizeClassName = {
  sm: "dc-textarea-sm",
  md: "dc-textarea-md",
  lg: "dc-textarea-lg",
};

const Textarea = forwardRef((props, ref) => {
  const {
    className,
    placeholder,
    disabled,
    size,
    label,
    name,
    value,
    onBlur,
    animateLabel,
    minHeight,
    removePaddings,
    maxHeight,
    ...rest
  } = props;
  const [isActive, setIsActive] = useState(false);
  const [maxHeightExceeded, setMaxHeightExceeded] = useState(false);
  const textareaSizeClassName = useRef(sizeClassName[size]);
  const textareaRef = useRef();

  const activeStatusHandler = () => {
    if (Boolean(value) || placeholder) setIsActive(true);
    else setIsActive(false);
  };

  useEffect(activeStatusHandler, [placeholder, value]);

  useEffect(() => {
    if (textareaRef.current) {
      const node = textareaRef.current;
      const adjustHeight = ({ target }) => {
        let paddings = 0;

        if (removePaddings) {
          const targetStyles = window.getComputedStyle(target, null);
          const paddingTop = +targetStyles.getPropertyValue("padding-top").replace("px", "");
          const paddingBottom = +targetStyles.getPropertyValue("padding-bottom").replace("px", "");

          paddings += paddingTop + paddingBottom;
        }

        if (maxHeight) {
          if (target.scrollHeight > maxHeight) {
            setMaxHeightExceeded(true);
          } else {
            setMaxHeightExceeded(false);
          }
        }

        target.style.height = "auto";
        target.style.height = `${target.scrollHeight - paddings}px`;
      };

      node.style.minHeight = `${minHeight || node.scrollHeight}px`;
      node.style.height = `${minHeight}px`;
      node.addEventListener("input", adjustHeight);
      ref(textareaRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocusHandler = () => {
    if (rest.onFocus) rest.onFocus();
    setIsActive(true);
  };

  const onBlurHandler = () => {
    onBlur();
    activeStatusHandler();
  };

  return (
    <>
      {label && (
        <label
          className={cs(
            "form-control-label",
            isActive && "is-active",
            !animateLabel && "no-animation"
          )}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="dc-textarea_wrapper">
        <textarea
          id={name}
          name={name}
          value={value}
          ref={textareaRef}
          className={cs(
            className,
            "dc-textarea",
            textareaSizeClassName.current,
            maxHeightExceeded && "scroll"
          )}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          {...rest}
        />
      </div>
    </>
  );
});

Textarea.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  animateLabel: PropTypes.bool,
  minHeight: PropTypes.number,
  removePaddings: PropTypes.bool,
  maxHeight: PropTypes.number,
};

Textarea.defaultProps = {
  size: "md",
  onBlur: () => null,
  value: "",
  removePaddings: false,
};

Textarea.displayName = "Textarea";

export default Textarea;
