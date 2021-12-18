import PropTypes from "prop-types";
import React from "react";
import SignupProgressStep from "./SignupProgressStep";
import cs from "@/utils/classNames";

export default function SignupProgress(props) {
  const { className, steps } = props;

  const Steps = steps.map((step) => <SignupProgressStep key={step.name} step={step} />);

  return (
    <div className={cs("signup-progress", className)} style={{ "--step-count": steps.length }}>
      {Steps}
    </div>
  );
}

SignupProgress.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.bool,
      link: PropTypes.string,
    }),
  ),
};

SignupProgress.defaultProps = {
  steps: [],
};
