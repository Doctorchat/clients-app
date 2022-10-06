import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import BackTitle from "@/components/BackTitle";
import DocInfo from "@/components/DocInfo";
import { PopupContent,PopupHeader } from "@/components/Popup";
import { startConversationTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { getUserInfo } from "@/store/actions";
import objectIsEmpty from "@/utils/objectIsEmpty";

export default function ClientFindDoc() {
  const {
    userInfo: { temp, data, selectedId, isLoading },
  } = useSelector((store) => ({ userInfo: store.userInfo }));
  const { updateTabsConfig } = useTabsContext();
  const [docCurrentInfo, setDocCurrentInfo] = useState({});
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedId) {
      dispatch(getUserInfo(selectedId));
    }
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (objectIsEmpty(data)) {
      setDocCurrentInfo(temp);
    } else {
      setDocCurrentInfo(data);
    }
  }, [temp, data]);

  return (
    <div className="popup-body star-conversation-doc-info">
      <PopupHeader
        title={
          <BackTitle
            title={t("information_about_doctor")}
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
