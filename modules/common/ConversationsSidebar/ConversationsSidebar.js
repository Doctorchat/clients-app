import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
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
import { ClientStartConversationMenu } from "@/modules/client";

export default function ConversationsSidebar() {
  const { conversationList } = useSelector((store) => ({
    conversationList: store.conversationList,
  }));
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(conversationList.data);
  }, [conversationList.data, searchConfig]);

  const fetchConversationList = useCallback(() => dispatch(getConversationList()), [dispatch]);

  useEffect(() => {
    fetchConversationList();

    let interval = setInterval(fetchConversationList, 15000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              status: !currentList.length && conversationList.isLoading,
              skeleton: ConversationItemSkeleton,
            }}
            errorConfig={{
              status: conversationList.isError,
              extra: (
                <Button type="outline" onClick={window.location.reload}>
                  {t("reload_page")}
                </Button>
              ),
            }}
            emptyConfig={{
              status: !currentList.length,
              className: "pt-4",
              content: searchConfig.active ? t("search_not_found") : t("conversation_list_empty"),
              extra: (
                <AuthRoleWrapper roles={[userRoles.get("client")]}>
                  <ClientStartConversationMenu placement="bottomCenter">
                    <Button className="mt-3" onClick={openStartConversation}>
                      {t("select_doctor")}
                    </Button>
                  </ClientStartConversationMenu>
                </AuthRoleWrapper>
              ),
            }}>
            <ConversationList conversations={currentList} activeConversation={id} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
