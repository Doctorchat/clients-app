import { forwardRef } from "react";
import Spinner from "../Spinner";

const FullPageLoading = forwardRef((_, ref) => {
  return (
    <div className="full-page-loading" ref={ref}>
      <Spinner />
    </div>
  );
});

FullPageLoading.displayName = "FullPageLoading";

export default FullPageLoading;
