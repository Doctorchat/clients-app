import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
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
import useCurrency from "@/hooks/useCurrency";
import useMessageFromValues from "@/hooks/useMessageFromValues";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import ImageIcon from "@/icons/file-png.svg";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { TimeSelection } from "./TimeSelection";

const messageSchema = object().shape({
  content: string().min(25).max(2500).required(),
});

export const MessageForm = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const { global } = useSelector((store) => ({
    global: store.bootstrap.payload?.global,
  }));
  const { formatPrice } = useCurrency();

  const resolver = useYupValidationResolver(messageSchema);
  const form = useForm({ resolver });

  const {
    values: persistedValues,
    setValues: setPersistedValues,
    resetValues: resetPersistedValues,
  } = useMessageFromValues(router.query.chatId);

  const [doctor, setDoctor] = React.useState(0);
  const [messageType, setMessageType] = React.useState("");
  const [attachments, setAttachments] = React.useState({ list: [], price: 0, initiated: false });
  const [isLoading, setIsLoading] = React.useState(true);
  const [confirmationData, setConfirmationData] = React.useState(null);
  const [confirmationDialogVisible, setConfirmationDialogVisible] = React.useState(false);

  const description = t("message_uploads_description", {
    amount: formatPrice(global.attach),
  });
  const doctorPrice = React.useMemo(() => {
    let price = doctor.price;

    if (messageType === MESSAGE_TYPES.meet) {
      price = doctor.meet_price || 0;
    }

    if (doctor?.available_discount?.discount) {
      price = price - price * (doctor.available_discount.discount / 100);
    }

    return price;
  }, [doctor?.available_discount?.discount, doctor?.meet_price, doctor?.price, messageType]);

  useEffect(() => {
    if (!attachments.initiated && global?.attach && persistedValues?.uploads?.list) {
      let uploadsList = persistedValues?.uploads?.list ?? [];

      uploadsList = uploadsList.filter((item) =>
        dayjs(item.created_at ?? new Date()).isAfter(dayjs().subtract(1, "day"))
      );

      setAttachments({
        list: uploadsList,
        price: uploadsList.length * global.attach,
        initiated: true,
      });
    }
  }, [attachments.initiated, global?.attach, persistedValues?.uploads?.list]);

  useEffect(() => {
    if (!attachments.initiated && global?.attach && persistedValues?.uploads?.list) {
      let uploadsList = persistedValues?.uploads?.list ?? [];

      uploadsList = uploadsList.filter((item) =>
        dayjs(item.created_at ?? new Date()).isAfter(dayjs().subtract(1, "day"))
      );

      setAttachments({
        list: uploadsList,
        price: uploadsList.length * global.attach,
        initiated: true,
      });
    }
  }, [attachments.initiated, global?.attach, persistedValues?.uploads?.list]);

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values };

      if (!data.slot_id && messageType === MESSAGE_TYPES.meet) {
        document.querySelector(".message-form__time-selection").scrollIntoView({ behavior: "smooth" });
        dispatch(notification({ type: "error", title: "error", descrp: "wizard:please_select_time" }));
        return;
      }

      data.chat_id = Number(router.query.chatId);
      data.uploads_count = attachments.list.length;
      data.uploads_price = attachments.list.length * global.attach;
      data.price = doctorPrice;
      data.type = MESSAGE_TYPES.standard;
      data.isMeet = messageType === MESSAGE_TYPES.meet;
      data.uploads = attachments.list.map(({ file_id }) => file_id);

      setConfirmationData(data);
      setConfirmationDialogVisible(true);
      resetPersistedValues();
    },
    [attachments.list, dispatch, doctorPrice, global.attach, messageType, resetPersistedValues, router.query.chatId]
  );

  const setFileList = React.useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
      setPersistedValues({ uploads: newAttachments });
    },
    [global?.attach, setPersistedValues]
  );

  const onCloseConfirmationDialog = React.useCallback(() => {
    setConfirmationDialogVisible(false);
    setTimeout(() => setConfirmationData(null), 300);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const messageType = params.get("messageType");
    const doctorId = params.get("doctorId");

    if (messageType && doctorId) {
      if (doctorId === "auto") {
        setDoctor({ price: global.auto, meet_price: global.auto });
        setMessageType(messageType);
        setIsLoading(false);
      } else {
        getDoctor(doctorId).then((response) => {
          setDoctor(response);
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
        <Form
          className="registration-flow__form"
          methods={form}
          onValuesChange={(action) => {
            if (action.name && action.value) {
              setPersistedValues({ [action.name]: action.value });
            }
          }}
          onFinish={onSubmit}
          initialValues={{ content: persistedValues?.content }}
        >
          <div className="message-form-info">
            <h3>{t("message_from_info.title")}</h3>
            <p>{t("message_from_info.line1")}</p>
            <p>{t("message_from_info.line2")}</p>
            <p>{t("message_from_info.line3")}</p>
            <p>{t("message_from_info.line4")}</p>
          </div>

          {messageType === MESSAGE_TYPES.meet && (
            <TimeSelection doctorId={doctor?.id} onSelectSlot={(slotId) => form.setValue("slot_id", slotId)} />
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
              description={description}
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
                <strong>{formatPrice(doctorPrice + attachments.price)}</strong>
              </span>
            </div>
            <Button htmlType="submit">{t("continue")}</Button>
          </div>
        </Form>
      </div>

      <ConfirmationDialog
        data={confirmationData}
        visible={confirmationDialogVisible}
        onClosePopup={onCloseConfirmationDialog}
      />
    </>
  );
};
