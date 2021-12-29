import PropTypes from "prop-types";
import MessageMeet from "./MessageMeet";

export default function MessageType(props) {
  const { type, componentProps } = props;

  if (type === "meet") return <MessageMeet {...componentProps} />;

  return null;
}

MessageType.propTypes = {
  type: PropTypes.string,
  componentProps: PropTypes.object,
};

MessageType.defaultProps = {
  componentProps: {},
};
