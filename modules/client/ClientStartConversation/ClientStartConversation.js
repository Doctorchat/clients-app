import { useSelector, useDispatch } from "react-redux";
import ClientFindDoc from "./ClientFindDoc";
import Popup from "@/components/Popup";
import Tabs from "@/packages/Tabs";
import { docListTogglePopupVisibility } from "@/store/slices/docSelectListSlice";

export default function ClientStartConversation() {
  const { user, isOpen } = useSelector((store) => ({
    user: store.user,
    isOpen: store.docSelectList.isOpen,
  }));
  const dispatch = useDispatch();

  const popupVisibilityHandler = (v) => dispatch(docListTogglePopupVisibility(v));

  if (user.data.role !== 3) {
    return null;
  }

  return (
    <Popup id="select-doc" visible={isOpen} onVisibleChange={popupVisibilityHandler}>
      <Tabs>
        <Tabs.Pane>
          <ClientFindDoc />
        </Tabs.Pane>
      </Tabs>
    </Popup>
  );
}
