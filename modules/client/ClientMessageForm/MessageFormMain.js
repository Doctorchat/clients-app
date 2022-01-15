import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { messageFormSchema } from "@/services/validation";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import Upload from "@/components/Upload";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { messageFormTabs } from "@/context/TabsKeys";
import ImageIcon from "@/icons/file-img.svg";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import {
  messageFormSetConfirmation,
  messageFormUpdateUploads,
} from "@/store/slices/messageFormSlice";

export default function MessageFormMain() {
  const {
    messageForm: { values, chatId, uploads },
    userInfo,
    global,
  } = useSelector((store) => ({
    messageForm: store.messageForm,
    userInfo: store.userInfo.data,
    global: store.bootstrap.payload?.global,
  }));
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState({ list: [], price: 0, initiated: false });
  const { updateTabsConfig } = useTabsContext();
  const resolver = useYupValidationResolver(messageFormSchema);
  const form = useForm({ resolver });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!attachments.initiated && uploads?.list) {
      setAttachments({ ...uploads, initiated: true });
    }
  }, [attachments.initiated, uploads]);

  const onFormSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.uploads_count = attachments.list.length;
      data.uploads_price = attachments.list.length * global.attach;
      data.price = userInfo?.price;

      try {
        setLoading(true);
        dispatch(messageFormSetConfirmation(data));
        updateTabsConfig(messageFormTabs.confirm)();
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", description: "default_error_message" })
        );
      } finally {
        setLoading(false);
      }
    },
    [attachments.list.length, dispatch, global.attach, updateTabsConfig, userInfo?.price]
  );

  const setFileList = useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
      dispatch(messageFormUpdateUploads(newAttachments));
    },
    [dispatch, global.attach]
  );

  return (
    <div className="popup-body message-form-main">
      <PopupHeader title={t("message_form_title")} />
      <PopupContent>
        <div className="message-form">
          <div className="message-form-info">
            <h3>{t("message_from_info.title")}</h3>
            <p>{t("message_from_info.line1")}</p>
            <p>{t("message_from_info.line2")}</p>
            <p>{t("message_from_info.line3")}</p>
            <p>{t("message_from_info.line4")}</p>
          </div>
          <div className="message-form-inputs">
            <Form
              methods={form}
              onFinish={onFormSubmit}
              initialValues={{ content: values.content }}
            >
              <Form.Item name="content" label={t("explain_problem")}>
                <Textarea placeholder={t("message_form_placeholder")} />
              </Form.Item>
              <div className="message-form-uploads">
                <Form.Item name="uploads" label={t("message_uploads_label")}>
                  <Upload
                    action={messageUploadFile(chatId)}
                    description={t("message_uploads_description")}
                    icon={<ImageIcon />}
                    accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
                    fileList={attachments.list}
                    setFileList={setFileList}
                    defaultFileList={attachments.list}
                    displayList
                  />
                </Form.Item>
              </div>
              <div className="message-form-bottom">
                <div className="message-price">
                  <span className="message-price-active">
                    {userInfo?.price + attachments.price} Lei
                  </span>
                </div>
                <Button htmlType="submit" loading={loading}>
                  {t("continue")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </PopupContent>
    </div>
  );
}
