import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const portalContainers = {
  modalRoot: "#modals-root",
};

export default function Portal({ children, portalName }) {
  return ReactDOM.createPortal(children, document.querySelector(portalContainers[portalName]) || document.body);
}

Portal.propTypes = {
  portalName: PropTypes.string,
  children: PropTypes.any,
};
