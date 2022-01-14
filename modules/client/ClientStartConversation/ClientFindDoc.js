import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ClientDocsSearch } from "..";
import DocList from "@/components/DocList/";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { setTempUserInfo, setUserSelectedId } from "@/store/slices/userInfoSlice";
import { startConversationTabs } from "@/context/TabsKeys";
import List from "@/components/List";
import { DocItemSkeleton } from "@/components/DocItem";
import { getDocList } from "@/store/actions";
import { ContainerLoading } from "@/components/Spinner";

export default function ClientFindDoc() {
  const { docSelectList } = useSelector((store) => ({
    docSelectList: store.docSelectList,
  }));
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const { t } = useTranslation();
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(docSelectList.data);
  }, [docSelectList.data, searchConfig]);

  useEffect(() => {
    dispatch(getDocList());
  }, [dispatch]);

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
      <PopupHeader title={t('select_doctor')} />
      <PopupContent>
        <ClientDocsSearch updateSearchConfig={updateSearchConfig} localList={docSelectList.data} />
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
            content: searchConfig.active
              ? t('search_not_found')
              : t('doctor_list_empty'),
          }}
        >
          <DocList onDocClick={onDocClick} data={currentList} />
        </List>
      </PopupContent>
      <ContainerLoading loading={searchConfig.loading} />
    </div>
  );
}
