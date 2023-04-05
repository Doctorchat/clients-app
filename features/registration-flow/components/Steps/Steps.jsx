import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

const steps = ["account", "doctor", "confirmation", "consultation"];

export const Steps = ({ activeStep }) => {
  const { t } = useTranslation();

  const activeSteps = React.useMemo(() => {
    const index = steps.indexOf(activeStep);
    return steps.slice(0, index + 1);
  }, [activeStep]);

  return (
    <div className="registration-flow__steps">
      <div className="registration-flow__step">
        {t("wizard:account")}
        <span className={cs("registration-flow__step-line", activeSteps.includes("account") ? "active" : "")} />
      </div>
      <div className="registration-flow__step">
        {t("wizard:doctor")}
        <span className={cs("registration-flow__step-line", activeSteps.includes("doctor") ? "active" : "")} />
      </div>
      <div className="registration-flow__step">
        {t("wizard:confirmation")}
        <span className={cs("registration-flow__step-line", activeSteps.includes("confirmation") ? "active" : "")} />
      </div>
      <div className="registration-flow__step">
        {t("wizard:consultation")}
        <span className={cs("registration-flow__step-line", activeSteps.includes("consultation") ? "active" : "")} />
      </div>
    </div>
  );
};

Steps.propTypes = {
  activeStep: PropTypes.string,
};
