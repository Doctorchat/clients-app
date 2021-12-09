import { useSelector } from "react-redux";
import { PopupHeader, PopupContent } from "@/components/Popup";
import DocInfo from "@/components/DocInfo";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { startConversationTabs } from "@/context/TabsKeys";

export default function StartConversationDocInfo() {
  const { docSelectInfo } = useSelector((store) => ({ docSelectInfo: store.docSelectInfo }));
  const { updateTabsConfig } = useTabsContext();

  return (
    <div className="popup-body star-coversation-doc-info">
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
          scrollableContainer=".star-coversation-doc-info .popup-scroll-container"
          doctor={docSelectInfo.data}
        />
      </PopupContent>
    </div>
  );
}
