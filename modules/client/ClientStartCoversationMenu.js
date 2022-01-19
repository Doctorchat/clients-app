import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { ClientSelectMode } from ".";
import Dropdown from "@/components/Dropdown";
import { selectModeTabs } from "@/context/TabsKeys";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import { CHAT_TYPES } from "@/context/constants";

export default function ClientStartConversationMenu(props) {
  const { children, placement } = props;
  const [chatType, setChatType] = useState("");
  const dispatch = useDispatch();

  const selectOptionHandler = useCallback((type) => {
    if (type === "council") {
      setChatType(CHAT_TYPES.consilium);
    } else if (type === "autoselect") {
      setChatType(CHAT_TYPES.auto);
    }
  }, []);

  const selectModeHandler = useCallback(
    (type) => {
      if (type === "message") {
        dispatch(messageFormToggleVisibility(true));
      }
    },
    [dispatch]
  );

  return (
    <Dropdown
      className="text-left"
      overlay={
        <ClientSelectMode
          activeTab={selectModeTabs.menu}
          docId={1}
          onSelectMode={selectModeHandler}
          formsBackKey={selectModeTabs.menu}
          onMenuItemSelected={selectOptionHandler}
          chatType={chatType}
        />
      }
      placement={placement}
    >
      {children}
    </Dropdown>
  );
}

ClientStartConversationMenu.propTypes = {
  children: PropTypes.element,
  placement: PropTypes.string,
};
