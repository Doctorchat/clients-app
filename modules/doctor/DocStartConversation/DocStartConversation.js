import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { DocItemSkeleton } from "@/components/DocItem";
import DocList from "@/components/DocList";
import List from "@/components/List";
import Popup from "@/components/Popup";
import { ClientDocsSearch } from "@/modules/client";
import api from "@/services/axios/api";
import { addConversation } from "@/store/slices/conversationListSlice";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import { notification } from "@/store/slices/notificationsSlice";
import { setTempUserInfo } from "@/store/slices/userInfoSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function DocStartConversation() {
  const { t } = useTranslation();
  const { docSelectList, isOpen } = useSelector((store) => ({
    docSelectList: store.docSelectList,
    isOpen: store.docSelectList.isOpen,
  }));
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const [filters, setFilters] = useState({
    online: false,
    category: null,
  });
  const dispatch = useDispatch();
  const history = useRouter();

  const filterList = useCallback(
    (list) => {
      let filteredList = [...list];

      if (filters.category?.label && filters.category.value !== "all") {
        filteredList = filteredList.filter((item) =>
          item.category.includes(filters.category?.label)
        );
      }

      if (filters.online) {
        filteredList = filteredList.filter((item) => Boolean(item.isOnline));
      }

      return filteredList;
    },
    [filters.category, filters.online]
  );

  useEffect(() => {
    if (searchConfig.active) setCurrentList(filterList(searchConfig.list));
    else setCurrentList(filterList(docSelectList.data));
  }, [docSelectList.data, filterList, searchConfig]);

  const VisibilityHandler = (v) => dispatch(docListToggleVisibility(v));

  const onDocClick = React.useCallback(
    (info) => async () => {
      dispatch(setTempUserInfo(info));

      const data = {
        doctor_id: info.id,
        type: "internal",
        investigation_id: 1,
      };

      try {
        const response = await api.conversation.create(data);

        dispatch(addConversation(response.data));
        dispatch(docListToggleVisibility(false));

        history.push(`/chat?id=${response.data.id}`);
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
      }
    },
    [dispatch, history]
  );

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  return (
    <Popup id="doc-select-doc" visible={isOpen} onVisibleChange={VisibilityHandler}>
      <Popup.Header title={t("select_doctor")} />
      <Popup.Content>
        <ClientDocsSearch
          updateSearchConfig={updateSearchConfig}
          localList={docSelectList.data}
          filters={filters}
          setFilters={setFilters}
        />
        <List
          loaded={docSelectList.isLoaded}
          loadingConfig={{
            status: docSelectList.isLoading,
            skeleton: DocItemSkeleton,
            className: "doclist",
          }}
          errorConfig={{ status: docSelectList.isError }}
          emptyConfig={{
            status: !currentList.length,
            className: "pt-4",
            content: searchConfig.active ? t("search_not_found") : t("doctor_list_empty"),
          }}
        >
          <DocList onDocClick={onDocClick} data={currentList} />
        </List>
      </Popup.Content>
    </Popup>
  );
}
