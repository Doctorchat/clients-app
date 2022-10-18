import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { DocItemSkeleton } from "@/components/DocItem";
import DocList from "@/components/DocList/";
import List from "@/components/List";
import { PopupContent, PopupHeader } from "@/components/Popup";
import { ContainerLoading } from "@/components/Spinner";
import { startConversationTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { setTempUserInfo, setUserSelectedId } from "@/store/slices/userInfoSlice";

import ClientDocsSearch from "../ClientDocsSearch";

export default function ClientFindDoc() {
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
  const { t, i18n } = useTranslation();
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  const {
    data: doctors,
    isFetching,
    isFetched,
    isError,
  } = useQuery(["doctors", i18n.language], () => api.docList.get({ locale: i18n.language }), {
    keepPreviousData: true,
    placeholderData: { data: [] },
  });

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
    else setCurrentList(filterList(doctors.data));
  }, [doctors, filterList, searchConfig]);

  const onDocClick = useCallback(
    (info) => () => {
      updateTabsConfig(startConversationTabs.docInfo)();
      dispatch(setTempUserInfo(info));
      dispatch(setUserSelectedId(info.id));
    },
    [dispatch, updateTabsConfig]
  );

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  return (
    <div className="popup-body position-relative">
      <PopupHeader title={t("select_doctor")} />
      <PopupContent>
        <ClientDocsSearch
          updateSearchConfig={updateSearchConfig}
          localList={doctors.data}
          filters={filters}
          setFilters={setFilters}
        />
        <List
          loadingConfig={{
            status: !isFetched && isFetching,
            skeleton: DocItemSkeleton,
            className: "doclist",
          }}
          errorConfig={{ status: isError }}
          emptyConfig={{
            status: !currentList.length,
            className: "pt-4",
            content: searchConfig.active ? t("search_not_found") : t("doctor_list_empty"),
          }}
        >
          <DocList onDocClick={onDocClick} data={currentList} />
        </List>
      </PopupContent>
      <ContainerLoading loading={searchConfig.loading} />
    </div>
  );
}
