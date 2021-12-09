import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocList from "@/components/DocList/";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { updateSelectedDocId } from "@/store/slices/docSelectInfoSlice";
import { startConversationTabs } from "@/context/TabsKeys";

export default function ClientFindDoc() {
  const { docSelectList } = useSelector((store) => ({
    docSelectList: store.docSelectList,
  }));
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  const onDocClick = useCallback(
    ({ id }) =>
      () => {
        updateTabsConfig(startConversationTabs.docInfo)();
        dispatch(updateSelectedDocId(id));
      },
    [dispatch, updateTabsConfig]
  );

  return (
    <div className="popup-body">
      <PopupHeader title="Selecteză un doctor" />
      <PopupContent>
        <DocList onDocClick={onDocClick} listSlice={docSelectList} />
      </PopupContent>
    </div>
  );
}
