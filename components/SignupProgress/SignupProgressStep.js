import PropTypes from "prop-types";
import React from "react";
import cs from "@/utils/classNames";

export default function SignupProgressStep(props) {
  const { step } = props;

  const titleClickHandler = () => {
    if (step.link) {
      console.log(step.link);
    }
  };

  return (
    <div className={cs("signup-progress-step", step.status && "completed")}>
      <div className="signup-progress-step_caption">
        <h5 className="name" role="button" onClick={titleClickHandler}>
          {step.name}
        </h5>
      </div>
      <div className={cs("signup-progress-step_line", step.status && "completed")}>
        <svg
          className="signup-progress-step_arrow"
          width="4"
          height="9"
          viewBox="0 0 4 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L3.08297 3.89668C3.33244 4.2436 3.33391 4.71069 3.08665 5.05917L1 8"
            stroke="#F0F0F0"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

SignupProgressStep.propTypes = {
  step: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.bool,
    link: PropTypes.string,
  }),
};
