import PropTypes from "prop-types";
import { IconBtn } from "../Button";
import ClipIcon from "@/icons/clip.svg";


export default function MessageBarAttach(props) {
  const { chatId } = props;

  return (
    <>
      <IconBtn className="message-bar-attach" size="sm" icon={<ClipIcon />} />
    </>
  );
}

MessageBarAttach.propTypes = {};

MessageBarAttach.defaultProps = {};
