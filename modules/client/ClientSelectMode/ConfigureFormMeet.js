import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { CHAT_TYPES } from "@/context/constants";
import { selectModeTabs } from "@/context/TabsKeys";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { configureFormSchema } from "@/services/validation";
import { addConversation } from "@/store/slices/conversationListSlice";
import { meetFormUpdateChatId } from "@/store/slices/meetFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import SelectModeInvestigations from "./SelectModeInvestigations";

export default function ConfigureFormMeet() {
  const { updateTabsConfig, docId, onSelectMode, onCreated } = useTabsContext();
  const [loading, setLoading] = useState(false);
  const resolver = useYupValidationResolver(configureFormSchema);
  const form = useForm({ defaultValues: { isAnonym: false }, resolver });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.doctor_id = docId;
      data.type = CHAT_TYPES.standard;
      data.isMeet = true;

      try {
        setLoading(true);

        const response = await api.conversation.create(data);

        dispatch(addConversation(response.data));
        dispatch(meetFormUpdateChatId(response.data.id));
        onCreated(response.data.id);

        onSelectMode("meet");
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, docId, onSelectMode, onCreated]
  );

  return (
    <div className="configure-form-meet px-1">
      <BackTitle
        className="configure-form-title"
        title={t("online_meet")}
        onBack={updateTabsConfig(selectModeTabs.choose, "prev")}
      />
      <Form methods={form} onFinish={onFormSubmit}>
        <SelectModeInvestigations />
        <Button htmlType="submit" size="sm" loading={loading}>
          {t("continue")}
        </Button>
      </Form>
    </div>
  );
}
