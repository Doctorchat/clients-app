import { forwardRef } from "react";
import PropTypes from "prop-types";

import Spinner from "../Spinner";

const FullPageLoading = forwardRef(({ children }, ref) => {
  return (
    <div className="full-page-loading" ref={ref}>
      <Spinner />
      {children}
    </div>
  );
});

FullPageLoading.propTypes = {
  children: PropTypes.node,
};
FullPageLoading.displayName = "FullPageLoading";

export default FullPageLoading;
