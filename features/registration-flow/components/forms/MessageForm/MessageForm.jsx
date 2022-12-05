import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { object, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import FullPageLoading from "@/components/FullPageLoading";
import { Textarea } from "@/components/Inputs";
import Switch from "@/components/Switch";
import Upload from "@/components/Upload";
import { MESSAGE_TYPES } from "@/context/constants";
import { getDoctor } from "@/features/doctors/api";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import ImageIcon from "@/icons/file-png.svg";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import asPrice from "@/utils/asPrice";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { TimeSelection } from "./TimeSelection";

const messageSchema = object().shape({
  content: string().min(25).max(750).required(),
});

export const MessageForm = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const { global } = useSelector((store) => ({
    global: store.bootstrap.payload?.global,
  }));

  const resolver = useYupValidationResolver(messageSchema);
  const form = useForm({ resolver });

  const [doctor, setDoctor] = React.useState(0);
  const [chatType, setChatType] = React.useState("");
  const [messageType, setMessageType] = React.useState("");
  const [attachments, setAttachments] = React.useState({ list: [], price: 0, initiated: false });
  const [isLoading, setIsLoading] = React.useState(true);
  const [confirmationData, setConfirmationData] = React.useState(null);

  const doctorPrice = React.useMemo(
    () => (messageType === MESSAGE_TYPES.standard ? doctor.price : doctor.meet_price || 0),
    [messageType, doctor.meet_price, doctor.price]
  );

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values };

      if (!data.slot_id && messageType === MESSAGE_TYPES.meet) {
        document
          .querySelector(".message-form__time-selection")
          .scrollIntoView({ behavior: "smooth" });
        dispatch(
          notification({ type: "error", title: "error", descrp: "wizard:please_select_time" })
        );
        return;
      }

      data.chat_id = router.query.chatId;
      data.uploads_count = attachments.list.length;
      data.uploads_price = attachments.list.length * global.attach;
      data.price = doctorPrice;
      data.type = chatType;
      data.isMeet = messageType === MESSAGE_TYPES.meet;
      data.uploads = attachments.list.map(({ file_id }) => file_id);

      setConfirmationData(data);
    },
    [
      attachments.list,
      dispatch,
      doctorPrice,
      global?.attach,
      chatType,
      messageType,
      router.query.chatId,
    ]
  );

  const setFileList = React.useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
    },
    [global?.attach]
  );

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatType = params.get("chatType");
    const messageType = params.get("messageType");
    const doctorId = params.get("doctorId");

    if (messageType && doctorId) {
      if (doctorId === "auto") {
        setDoctor({ price: global.auto, meet_price: global.auto });
        setChatType(chatType);
        setMessageType(messageType);
        setIsLoading(false);
      } else {
        getDoctor(doctorId).then((response) => {
          setDoctor(response);
          setChatType(chatType);
          setMessageType(messageType);
          setIsLoading(false);
        });
      }
    } else {
      router.push("/registration-flow/select-doctor");
    }
  }, [global?.auto, router]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <>
      <div className="registration-flow__message-form">
        <Form className="registration-flow__form" methods={form} onFinish={onSubmit}>
          <div className="message-form-info">
            <h3>{t("message_from_info.title")}</h3>
            <p>{t("message_from_info.line1")}</p>
            <p>{t("message_from_info.line2")}</p>
            <p>{t("message_from_info.line3")}</p>
            <p>{t("message_from_info.line4")}</p>
          </div>

          {messageType === MESSAGE_TYPES.meet && (
            <TimeSelection
              doctorId={doctor?.id}
              onSelectSlot={(slotId) => form.setValue("slot_id", slotId)}
            />
          )}

          <div className="message-textarea__header">
            <label form="content">{t("explain_problem")}</label>
            <Form.Item className="mb-0" name="isAnonym" label={t("wizard:send_anonymously")}>
              <Switch labelAlign="left" />
            </Form.Item>
          </div>

          <Form.Item name="content">
            <Textarea placeholder={t("message_form_placeholder")} />
          </Form.Item>

          <Form.Item name="uploads" label={t("message_uploads_label")}>
            <Upload
              action={messageUploadFile(1)}
              description={t("message_uploads_description")}
              icon={<ImageIcon />}
              accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
              fileList={attachments.list}
              setFileList={setFileList}
              defaultFileList={attachments.list}
              displayList
            />
          </Form.Item>
          <div className="form-bottom">
            <div className="message-form__total">
              <span>{t("wizard:total")}:</span>
              <span>
                <strong>{asPrice(doctorPrice + attachments.price)}</strong>
              </span>
            </div>
            <Button htmlType="submit">{t("continue")}</Button>
          </div>
        </Form>
      </div>

      <ConfirmationDialog
        data={confirmationData}
        visible={!!confirmationData}
        onClose={() => setConfirmationData(null)}
      />
    </>
  );
};
