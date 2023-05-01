import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PropTypes from "prop-types";

import Checkbox from "@/components/Checkbox";
import { HOME_PAGE_URL } from "@/hooks/useRegion";

const AcceptTermsAndConditions = ({ value, setValue, disabled }) => {
  const handleChange = () => setValue((prev) => !prev);
  const { t } = useTranslation();
  return (
    <div className={clsx("confirmation-terms", { disabled })}>
      <Checkbox
        value={value}
        onChange={handleChange}
        label={
          <>
            {t("accept_terms")}{" "}
            <a
              href={`${HOME_PAGE_URL}termeni-si-conditii/`}
              target="_blank"
              rel="noreferrer noopener"
              className="terms"
            >
              {t("terms_conditions")}
            </a>
          </>
        }
      />
    </div>
  );
};

AcceptTermsAndConditions.propTypes = {
  value: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AcceptTermsAndConditions.defaultProps = {
  disabled: false,
};

export default AcceptTermsAndConditions;
