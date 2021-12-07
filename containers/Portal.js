import PropTypes from "prop-types";
import ReactDOM from "react-dom";

const portalContainers = {
  modalRoot: "#modals-root",
};

export default function Portal({ children, portalName }) {
  return ReactDOM.createPortal(children, document.querySelector(portalContainers[portalName]));
}

Portal.propTypes = {
  portalName: PropTypes.string,
  children: PropTypes.any,
};
