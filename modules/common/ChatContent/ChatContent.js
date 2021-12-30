import { useCallback } from "react";
import { useDispatch } from "react-redux";
import Image from "@/components/Image";
import Button, { IconBtn } from "@/components/Button";
import EllipsisIcon from "@/icons/ellipsis-v.svg";
import Sidebar from "@/components/Sidebar";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import auv from "@/imgs/auth-layout.jpg";

export default function ChatContent() {
  const dispatch = useDispatch();

  const openMessageFormPopup = useCallback(
    () => dispatch(messageFormToggleVisibility(true)),
    [dispatch]
  );

  return (
    <Sidebar id="column-center">
      <Sidebar.Header className="chat-content-header d-flex justify-contnet-between">
        <div className="header-info d-flex align-items-center">
          <div className="dialog-avatar">
            <Image w="42" h="42" alt={"ceva"} src={auv.src} />
          </div>
          <div className="user-caption ps-3">
            <h4 className="dialog-title mb-0">
              <span className="user-title">Full Name</span>
            </h4>
            <p className="dialog-subtitle mb-0">
              <span className="user-last-message ellipsis">last seen 15 min</span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <IconBtn icon={<EllipsisIcon />} size="sm" />
        </div>
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y conversation-content">
          <div className="chat-content-inner">MessageList</div>
        </div>
      </Sidebar.Body>
      <Sidebar.Footer className="chat-content-footer">
        <div className="w-100 d-flex justify-content-center">
          <Button type="text" onClick={openMessageFormPopup}>
            Începe Conversația
          </Button>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
}
