import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientDocsSearch } from "..";
import DocList from "@/components/DocList/";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { setDocSelectedId, setTempDocInfo } from "@/store/slices/docInfoSlice";
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
      dispatch(setTempDocInfo(info));
      dispatch(setDocSelectedId(info.id));
    },
    [dispatch, updateTabsConfig]
  );

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  return (
    <div className="popup-body position-relative">
      <PopupHeader title="Selecteză un doctor" />
      <PopupContent>
        <ClientDocsSearch updateSearchConfig={updateSearchConfig} localList={docSelectList.data} />
        <List
          loading={docSelectList.isLoading}
          loaded={docSelectList.isLoaded}
          error={docSelectList.isError}
          empty={!currentList.length}
          loadingClassName="doclist"
          skeleton={DocItemSkeleton}
          emptyDescription={
            searchConfig.active ? "Nu am găsit nici un doctor" : "Aici va apărea lista de doctori"
          }
          emptyClassName="pt-4"
        >
          <DocList onDocClick={onDocClick} data={currentList} />
        </List>
      </PopupContent>
      <ContainerLoading loading={searchConfig.loading} />
    </div>
  );
}
