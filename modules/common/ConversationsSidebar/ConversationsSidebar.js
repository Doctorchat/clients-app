import { useCallback, useEffect, useState } from "react";
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
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(conversationList.data);
  }, [conversationList.data, searchConfig]);

  useEffect(() => dispatch(getConversationList()), [dispatch]);

  const openStartConversation = useCallback(
    () => dispatch(docListToggleVisibility(true)),
    [dispatch]
  );

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  return (
    <Sidebar>
      <Sidebar.Header>
        <ConversationListHeader localList={currentList} updateSearchConfig={updateSearchConfig} />
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
              status: !currentList.length,
              className: "pt-4",
              content: searchConfig.active
                ? "Nu am găsit nici o coversație"
                : "Aici va apărea lista de conversații",
              extra: (
                <AuthRoleWrapper roles={[userRoles.get("client")]}>
                  <Button className="mt-3" onClick={openStartConversation}>
                    Selecteză doctor
                  </Button>
                </AuthRoleWrapper>
              ),
            }}
          >
            <ConversationList conversations={currentList} activeConversation={id} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
