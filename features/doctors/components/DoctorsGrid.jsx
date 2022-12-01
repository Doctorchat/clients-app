import PropTypes from "prop-types";

import { DoctorCardSkeleton } from "./DoctorCard";

export const DoctorsGrid = ({ isLoading = false, loadingItems = 8, children }) => {
  if (isLoading) {
    return (
      <div className="doctors-grid">
        {Array.from({ length: loadingItems }, (_, i) => (
          <DoctorCardSkeleton key={i} isLoading />
        ))}
      </div>
    );
  }

  return <div className="doctors-grid">{children}</div>;
};

DoctorsGrid.propTypes = {
  isLoading: PropTypes.bool,
  loadingItems: PropTypes.number,
  children: PropTypes.node,
};
