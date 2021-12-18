import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PopupHeader, PopupContent } from "@/components/Popup";
import DocInfo from "@/components/DocInfo";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { startConversationTabs } from "@/context/TabsKeys";
import { getDocInfo } from "@/store/actions";
import { cleanDocInfo } from "@/store/slices/docInfoSlice";
import objectIsEmpty from "@/utils/objectIsEmpty";

export default function ClientFindDoc() {
  const {
    docInfo: { temp, data, selectedId, isLoading },
  } = useSelector((store) => ({ docInfo: store.docInfo }));
  const { updateTabsConfig } = useTabsContext();
  const [docCurrentInfo, setDocCurrentInfo] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedId) {
      dispatch(getDocInfo(selectedId));
    }
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (objectIsEmpty(data)) {
      setDocCurrentInfo(temp);
    } else {
      setDocCurrentInfo(data);
    }
  }, [temp, data]);

  useEffect(() => {
    return () => {
      dispatch(cleanDocInfo());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="popup-body star-conversation-doc-info">
      <PopupHeader
        title={
          <BackTitle
            title="Informație despre doctor"
            onBack={updateTabsConfig(startConversationTabs.findDoc, "prev")}
          />
        }
      />
      <PopupContent>
        <DocInfo
          loading={isLoading}
          scrollableContainer=".star-conversation-doc-info .popup-scroll-container"
          doctor={docCurrentInfo}
        />
      </PopupContent>
    </div>
  );
}
