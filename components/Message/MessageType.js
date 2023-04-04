import PropTypes from "prop-types";

import MessageMeet from "./MessageMeet";

export default function MessageType(props) {
  const { type, ...rest } = props;

  if (type === "meet") return <MessageMeet {...rest} />;

  return null;
}

MessageType.propTypes = {
  type: PropTypes.string,
  componentProps: PropTypes.object,
};

MessageType.defaultProps = {
  componentProps: {},
};
