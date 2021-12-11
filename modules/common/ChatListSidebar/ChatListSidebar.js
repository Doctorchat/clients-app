import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar";
import ChatListHeader from "@/components/ChatListHeader";
import List from "@/components/List";
import ChatList from "@/components/ChatList";
import { getChatList } from "@/store/actions";
import { ChatItemSkeleton } from "@/components/ChatItem";
import Button from "@/components/Button";

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
          <List
            loading={chatList.isLoading}
            error={chatList.isError}
            empty={!chatList.data.length}
            loaded={chatList.isLoaded}
            skeleton={ChatItemSkeleton}
            errorExtra={<Button type="outline">Reâncarcă pargina</Button>}
          >
            <ChatList activeChat="2" data={chatList.data} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
