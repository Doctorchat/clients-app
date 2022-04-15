import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Popup from "@/components/Popup";
import List from "@/components/List";
import { DocItemSkeleton } from "@/components/DocItem";
import DocList from "@/components/DocList";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import { getDocList } from "@/store/actions";
import api from "@/services/axios/api";
import { setTempUserInfo } from "@/store/slices/userInfoSlice";
import { notification } from "@/store/slices/notificationsSlice";
import { addConversation } from "@/store/slices/conversationListSlice";

export default function DocStartConversation() {
  const { t } = useTranslation();
  const { docSelectList, isOpen } = useSelector((store) => ({
    docSelectList: store.docSelectList,
    isOpen: store.docSelectList.isOpen,
  }));
  const dispatch = useDispatch();
  const history = useRouter();

  React.useEffect(() => {
    dispatch(getDocList());
  }, [dispatch]);

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
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      }
    },
    [dispatch, history]
  );

  return (
    <Popup id="doc-select-doc" visible={isOpen} onVisibleChange={VisibilityHandler}>
      <Popup.Header title={t("select_doctor")} />
      <Popup.Content>
        <List
          loaded={docSelectList.isLoaded}
          loadingConfig={{
            status: docSelectList.isLoading,
            skeleton: DocItemSkeleton,
            className: "doclist",
          }}
          errorConfig={{ status: docSelectList.isError }}
          emptyConfig={{
            status: !docSelectList?.data?.length,
            className: "pt-4",
            content: t("doctor_list_empty"),
          }}
        >
          <DocList onDocClick={onDocClick} data={docSelectList?.data || []} />
        </List>
      </Popup.Content>
    </Popup>
  );
}
