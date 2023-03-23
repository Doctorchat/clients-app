import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import { PopupContent, PopupHeader } from "@/components/Popup";
import Upload from "@/components/Upload";
import { meetFormTabs } from "@/context/TabsKeys";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import ImageIcon from "@/icons/file-img.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { meetFormSchema } from "@/services/validation";
import { messageUploadFile } from "@/store/actions";
import { meetFormSetConfirmation, meetFormUpdateUploads } from "@/store/slices/meetFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import {getGlobalCurrency} from "@/store/slices/bootstrapSlice";

import MeetFormDateTime from "./MeetFormDateTime";

export default function MeetFormMain() {
  const {
    meetForm: { values, chatId, uploads },
    userInfo,
    chatUserInfo,
    global,
  } = useSelector((store) => ({
    meetForm: store.meetForm,
    userInfo: store.userInfo.data,
    chatUserInfo: store.chatUserInfo,
    global: store.bootstrap.payload?.global,
  }));
  const currency = useSelector(getGlobalCurrency);

  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState({ list: [], price: 0, initiated: false });
  const { updateTabsConfig } = useTabsContext();
  const resolver = useYupValidationResolver(meetFormSchema);
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

      if (!data.slot_id) {
        document
          .querySelector(".message-form__time-selection")
          .scrollIntoView({ behavior: "smooth" });
        dispatch(
          notification({ type: "error", title: "error", descrp: "wizard:please_select_time" })
        );
        return;
      }

      data.uploads_count = attachments.list.length;
      data.uploads_price = attachments.list.length * global.attach;
      data.price = userInfo?.meet_price;

      try {
        setLoading(true);
        dispatch(meetFormSetConfirmation(data));
        updateTabsConfig(meetFormTabs.confirm)();
      } catch (error) {
        dispatch(
          notification({
            type: "error",
            title: "error",
            description: getApiErrorMessages(error, true),
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [attachments.list.length, dispatch, global?.attach, updateTabsConfig, userInfo?.meet_price]
  );

  const setFileList = useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
      dispatch(meetFormUpdateUploads(newAttachments));
    },
    [dispatch, global?.attach]
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
              <MeetFormDateTime
                doctorId={userInfo?.id}
                onSelectSlot={(slotId) => form.setValue("slot_id", slotId)}
              />
              <Form.Item name="content" label={t("explain_problem")}>
                <Textarea placeholder={t("message_form_placeholder")} />
              </Form.Item>
              <div className="message-form-uploads">
                <Form.Item name="uploads" label={t("message_uploads_label")}>
                  <Upload
                    action={messageUploadFile(chatId)}
                    description={t("message_uploads_description", {currency})}
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
                    {(userInfo?.meet_price ?? chatUserInfo.data?.meet_price ?? 0) +
                      attachments.price}{" "}
                    {currency}
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
