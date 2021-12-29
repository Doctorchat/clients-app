import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import Image from "@/components/Image";
import { IconBtn } from "@/components/Button";
import EllipsisIcon from "@/icons/ellipsis-v.svg";
import auv from "@/imgs/auth-layout.jpg";
import SidebarBody from "@/components/Sidebar/SidebarBody";
import Sidebar from "@/components/Sidebar";
import Message from "@/components/Message";

export default function ChatContent() {
  return (
    <Sidebar id="column-center">
      <SidebarHeader className="chat-content-header d-flex justify-contnet-between">
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
      </SidebarHeader>
      <SidebarBody>
        <div className="scrollable scrollable-y conversation-content">
          <div className="chat-content-inner">
            <Message
              content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the"
              updated="2021-12-28 20:23:31"
              side="message-out"
              type="meet"
            />
            <Message
              content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was p"
              updated="2021-12-28 20:23:31"
              side="message-in"
              type="standard"
            />
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
