import clsx from "clsx";
import { t } from "i18next";
import PropTypes from "prop-types";

import Checkbox from "@/components/Checkbox";

const AcceptTermsAndConditions = ({ value, setValue, disabled }) => {
  const handleChange = () => setValue((prev) => !prev);

  return (
    <div className={clsx("confirmation-terms", { disabled })}>
      <Checkbox
        value={value}
        onChange={handleChange}
        label={
          <>
            {t("accept_terms")}{" "}
            <a
              href="https://doctorchat.md/termeni-si-conditii/"
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
