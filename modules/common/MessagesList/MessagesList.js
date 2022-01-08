import PropTypes from "prop-types";
import { useMemo } from "react";
import Message from "@/components/Message";

export default function MessagesList(props) {
  const { list } = props;

  const Messages = useMemo(
    () =>
      list.map((msg) => (
        <Message
          key={msg.id}
          content={msg.content}
          side={msg.side}
          type={msg.type}
          updated={msg.updated}
          seen={msg.seen}
          files={msg.files}
        />
      )),
    [list]
  );

  return Messages;
}

MessagesList.propTypes = {
  list: PropTypes.array,
};

MessagesList.defaultProps = {
  list: [],
};
