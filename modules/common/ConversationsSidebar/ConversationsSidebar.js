import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar";
import ConversationListHeader from "@/components/ConversationListHeader";
import ConversationList from "@/components/ConversationList";
import List from "@/components/List";
import { getConversationList } from "@/store/actions";
import Button from "@/components/Button";
import { docListTogglePopupVisibility } from "@/store/slices/docSelectListSlice";
import { ConversationItemSkeleton } from "@/components/ConversationItem";

export default function ConversationsSidebar() {
  const { conversationList } = useSelector((store) => ({
    conversationList: store.conversationList,
  }));
  const dispatch = useDispatch();

  useEffect(() => dispatch(getConversationList()), [dispatch]);

  const openStartConversation = useCallback(
    () => dispatch(docListTogglePopupVisibility(true)),
    [dispatch]
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <ConversationListHeader />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y conversation-list-parts">
          <List
            loading={conversationList.isLoading}
            error={conversationList.isError}
            empty={!conversationList.data.length}
            loaded={conversationList.isLoaded}
            skeleton={ConversationItemSkeleton}
            emptyClassName="pt-4"
            errorExtra={<Button type="outline">Reâncarcă pargina</Button>}
            emptyExtra={
              <Button className="mt-3" onClick={openStartConversation}>
                Selecteză doctor
              </Button>
            }
          >
            <ConversationList conversations={conversationList.data} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
