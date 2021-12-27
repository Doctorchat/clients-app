import { forwardRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import SelectModeInvestigations from "./SelectModeInvestigations";
import BackTitle from "@/components/BackTitle";
import { selectModeTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Form from "@/components/Form";
import Switch from "@/components/Switch";
import Button from "@/components/Button";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { addConversation } from "@/store/slices/conversationListSlice";
import { CHAT_TYPES } from "@/context/constants";
import { messageFormUpdateChatId } from "@/store/slices/messageFormSlice";

const ConfigureFormMessage = forwardRef((props, ref) => {
  const { updateTabsConfig, docId, onSelectMode } = useTabsContext();
  const [loading, setLoading] = useState(false);
  const form = useForm({ defaultValues: { isAnonym: false } });
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.doctor_id = docId;
      data.type = CHAT_TYPES.standard;

      try {
        setLoading(true);

        const response = await api.conversation.create(data);

        dispatch(addConversation(response.data));
        dispatch(messageFormUpdateChatId(response.data.id));

        onSelectMode("message");
      } catch (error) {
        dispatch(notification({ type: "error", title: "Eroare", descrp: "A apărut o eroare" }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, docId, onSelectMode]
  );

  return (
    <div className="configure-form-message px-1" ref={ref}>
      <BackTitle
        className="configure-form-title"
        title="Mesaj simplu"
        onBack={updateTabsConfig(selectModeTabs.choose, "prev")}
      />
      <Form methods={form} onFinish={onFormSubmit}>
        <SelectModeInvestigations />
        <Form.Item name="isAnonym" label="Doresc Anonimitate">
          <Switch />
        </Form.Item>
        <Button htmlType="submit" size="sm" loading={loading}>
          Continuă
        </Button>
      </Form>
    </div>
  );
});

ConfigureFormMessage.displayName = "ConfigureFormMessage";

export default ConfigureFormMessage;
