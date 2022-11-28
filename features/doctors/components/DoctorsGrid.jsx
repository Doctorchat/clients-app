import PropTypes from "prop-types";

export const DoctorsGrid = ({ children }) => {
  return <div className="doctors-grid">{children}</div>;
};

DoctorsGrid.propTypes = {
  children: PropTypes.node,
};
