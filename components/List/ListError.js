import { forwardRef,memo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Spinner from "@/components/Spinner";
import WarnIcon from "@/icons/warn-duo.svg";

const ListError = forwardRef(({ extra }, ref) => {
  const { t } = useTranslation();

  return (
    <div className="list-error" ref={ref}>
      <div className="list-error-icon">
        <WarnIcon />
      </div>
      <h3 className="list-error-title">{t("default_error_message")}</h3>
      <p className="list-error-descrp d-flex align-items-center">
        <Spinner className="mr-1" /> <span>{t("fixing")}...</span>
      </p>
      {extra}
    </div>
  );
});

ListError.propTypes = {
  extra: PropTypes.element,
};

ListError.displayName = "ListError";

export default memo(ListError);
