import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Switch from "@/components/Switch";
import { selectModeTabs } from "@/context/TabsKeys";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { configureFormSchema } from "@/services/validation";
import { addConversation } from "@/store/slices/conversationListSlice";
import { messageFormUpdateChatId } from "@/store/slices/messageFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import SelectModeInvestigations from "./SelectModeInvestigations";

export default function ConfigureFormMessage() {
  const { updateTabsConfig, docId, onSelectMode, onCreated, formsBackKey, chatType } = useTabsContext();
  const [loading, setLoading] = useState(false);
  const resolver = useYupValidationResolver(configureFormSchema);
  const form = useForm({ defaultValues: { isAnonym: false }, resolver });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.doctor_id = docId;
      data.type = chatType;

      try {
        setLoading(true);

        const response = await api.conversation.create(data);

        dispatch(addConversation(response.data));
        dispatch(messageFormUpdateChatId(response.data));
        onCreated(response.data.id);

        onSelectMode("message");
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(false);
      }
    },
    [chatType, dispatch, docId, onCreated, onSelectMode]
  );

  return (
    <div className="configure-form-message">
      <BackTitle
        className="configure-form-title"
        title={t("simple_message")}
        onBack={updateTabsConfig(formsBackKey || selectModeTabs.choose, "prev")}
      />
      <Form methods={form} onFinish={onFormSubmit}>
        <SelectModeInvestigations />
        <Form.Item name="isAnonym" label={t("want_anonymity")}>
          <Switch />
        </Form.Item>
        <Button htmlType="submit" size="sm" loading={loading}>
          {t("continue")}
        </Button>
      </Form>
    </div>
  );
}
