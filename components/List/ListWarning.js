import PropTypes from "prop-types";
import { memo, forwardRef } from "react";
import WarnIcon from "@/icons/warn-duo.svg";

const ListWarning = forwardRef(({ extra }, ref) => (
  <div className="list-warning" ref={ref}>
    <div className="list-warning-icon">
      <WarnIcon />
    </div>
    <h3 className="list-warning-title">Atenție</h3>
    <p className="mb-0">Сontul dvs. este în curs de verificare.</p>
    <p>
      La finalizarea procesului de verificare, veți primi un e-mail la adresa de e-mail specificată
    </p>
    {extra}
  </div>
));

ListWarning.propTypes = {
  extra: PropTypes.element,
};

ListWarning.displayName = "ListWarning";

export default memo(ListWarning);
