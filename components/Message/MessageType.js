import PropTypes from "prop-types";

import MessageMeet from "./MessageMeet";

export default function MessageType(props) {
  if (props.type === "meet") return <MessageMeet {...props} />;

  return null;
}

MessageType.propTypes = {
  type: PropTypes.string,
  componentProps: PropTypes.object,
  status: PropTypes.string,
};

MessageType.defaultProps = {
  componentProps: {},
};
