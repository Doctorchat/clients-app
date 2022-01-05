import PropTypes from "prop-types";
import { memo, forwardRef } from "react";
import Spinner from "@/components/Spinner";
import WarnIcon from "@/icons/warn-duo.svg";

const ListError = forwardRef(({ extra }, ref) => (
  <div className="list-error" ref={ref}>
    <div className="list-error-icon">
      <WarnIcon />
    </div>
    <h3 className="list-error-title">A apărut o eroare</h3>
    <p className="list-error-descrp d-flex align-items-center">
      <Spinner className="mr-1" /> <span>Lucrăm...</span>
    </p>
    {extra}
  </div>
));

ListError.propTypes = {
  extra: PropTypes.element,
};

ListError.displayName = "ListError";

export default memo(ListError);
