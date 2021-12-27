import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import ConversationListHeader from "@/components/ConversationListHeader";
import ConversationList from "@/components/ConversationList";
import List from "@/components/List";
import { getConversationList } from "@/store/actions";
import Button from "@/components/Button";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import { ConversationItemSkeleton } from "@/components/ConversationItem";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

export default function ConversationsSidebar() {
  const { conversationList } = useSelector((store) => ({
    conversationList: store.conversationList,
  }));
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  useEffect(() => dispatch(getConversationList()), [dispatch]);

  const openStartConversation = useCallback(
    () => dispatch(docListToggleVisibility(true)),
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
            loaded={conversationList.isLoaded}
            loadingConfig={{
              status: conversationList.isLoading,
              skeleton: ConversationItemSkeleton,
            }}
            errorConfig={{
              status: conversationList.isError,
              extra: <Button type="outline">Reâncarcă pagina</Button>,
            }}
            emptyConfig={{
              status: !conversationList.data.length,
              className: "pt-4",
              extra: (
                <AuthRoleWrapper roles={[userRoles.get("client")]}>
                  <Button className="mt-3" onClick={openStartConversation}>
                    Selecteză doctor
                  </Button>
                </AuthRoleWrapper>
              ),
            }}
          >
            <ConversationList conversations={conversationList.data} activeConversation={id} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
