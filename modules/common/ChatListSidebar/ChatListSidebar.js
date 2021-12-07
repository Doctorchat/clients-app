import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar";
import ChatListHeader from "@/components/ChatListHeader";
import ChatList from "@/components/ChatList";
import { getChatList } from "@/store/actions";
// import { userRoles } from "@/context/constants";

export default function ChatListSidebar() {
  const { chatList } = useSelector((store) => ({ chatList: store.chatList }));
  const dispatch = useDispatch();

  useEffect(() => dispatch(getChatList()), [dispatch]);

  return (
    <Sidebar>
      <Sidebar.Header>
        <ChatListHeader />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y chatlist-parts">
          <ChatList activeChat="2" listSlice={chatList} />
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
