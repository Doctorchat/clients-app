import React from "react";
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
import api from "@/services/axios/api";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import cs from "@/utils/classNames";

import { ConfirmationDialog } from "./ConfirmationDialog";
import { TimeSelection } from "./TimeSelection";

export const MessageForm = () => {
  const { t } = useTranslation();  
  const dispatch = useDispatch();
  const router = useRouter();
   const messageSchema = object().shape({
  content: string()
    .required()
    .test("noSpaces", t("chats_valiation", {min:25, max:3000}), (value) => {
      const charCountWithoutSpaces = value.replace(/\s/g, "").length;
      return charCountWithoutSpaces >= 25 && charCountWithoutSpaces <= 3000;
    }),
});

  const { global } = useSelector((store) => ({
    global: store.bootstrap.payload?.global,
  }));
  const user = useSelector((state) => state.user.data);
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
  const [attachments, setAttachments] = React.useState({ list: [], price: 0, discountedPrice: 0, initiated: false });
  const [isLoading, setIsLoading] = React.useState(true);
  const [confirmationData, setConfirmationData] = React.useState(null);
  const [confirmationDialogVisible, setConfirmationDialogVisible] = React.useState(false);
  const [filesAvailable, setFilesAvailable] = React.useState(0);

  const description = t("message_uploads_description", {
    amount: formatPrice(global.attach),
  });

  const descriptionFree = t("message_uploads_description_free", {
    freeImages: filesAvailable,
  });
  const doctorPrice = React.useMemo(() => {
    let price = doctor.price;

    if (messageType === MESSAGE_TYPES.meet) {
      price = doctor.meet_price || 0;
    }

    return price;
  }, [doctor.meet_price, doctor.price, messageType]);
  const discountedDoctorPrice = React.useMemo(() => {
    let price = doctorPrice;

    if (doctor?.available_discount?.discount) {
      price = price - price * (doctor.available_discount.discount / 100);
    }

    return price;
  }, [doctor?.available_discount?.discount, doctorPrice]);

  React.useEffect(() => {
    const getFilesAvailable = async () => {
      try {
        const response = await api.conversation.single(Number(router.query.chatId));
        setFilesAvailable(response.data.freeFilesAvailable);
      } catch (error) {
        console.error("A apărut o eroare la apelul API:", error);
      }
    };
    getFilesAvailable();
  }, []);

  React.useEffect(() => {
    if (!attachments.initiated && global?.attach && persistedValues?.uploads?.list) {
      let uploadsList = persistedValues?.uploads?.list ?? [];
      let priceFiles = persistedValues?.uploads?.price ?? 0;

      uploadsList = uploadsList.filter((item) =>
        dayjs(item.created_at ?? new Date()).isAfter(dayjs().subtract(1, "day"))
      );

      setAttachments({
        list: uploadsList,
        price: priceFiles,
        initiated: true,
      });
    }
  }, [attachments.initiated, global?.attach, persistedValues?.uploads?.list, persistedValues?.uploads?.price]);

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
      data.uploads_price =
        attachments.list.length > filesAvailable ? (attachments.list.length - filesAvailable) * global.attach : 0;
      data.price = discountedDoctorPrice || doctorPrice;
      data.type = MESSAGE_TYPES.standard;
      data.isMeet = messageType === MESSAGE_TYPES.meet;
      data.uploads = attachments.list.map(({ file_id }) => file_id);

      if (doctor?.available_discount?.discount) {
        const discountedGlobalAttach = global.attach - global.attach * (doctor.available_discount.discount / 100);
        data.uploads_price =
          attachments.list.length > filesAvailable
            ? (attachments.list.length - filesAvailable) * discountedGlobalAttach
            : 0;
      }

      window.dataLayer?.push({
        event: "date_selected",
        UserID: user?.id,
      });

      setConfirmationData(data);
      setConfirmationDialogVisible(true);
      resetPersistedValues();
    },
    [
      attachments.list,
      discountedDoctorPrice,
      dispatch,
      doctor?.available_discount?.discount,
      doctorPrice,
      global.attach,
      messageType,
      resetPersistedValues,
      router.query.chatId,
      user?.id,
      filesAvailable,
    ]
  );

  const setFileList = React.useCallback(
    (fileList) => {
      const newAttachments = { list: fileList };
      newAttachments.price = fileList.length > filesAvailable ? (fileList.length - filesAvailable) * global.attach : 0;

      if (doctor?.available_discount?.discount) {
        const discountedGlobalAttach = global.attach - global.attach * (doctor.available_discount.discount / 100);
        newAttachments.discountedPrice = fileList.length * discountedGlobalAttach;
      }

      setAttachments({ ...newAttachments, initiated: true });
      setPersistedValues({ uploads: newAttachments });
    },
    [doctor?.available_discount?.discount, global.attach, setPersistedValues, filesAvailable]
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
            if (action.name ) {
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
          <p className="textarea-counter">{persistedValues?.content.replace(/\s/g, "").length ?? "0"}/3000</p>
          <Form.Item name="uploads" label={t("message_uploads_label")}>
            <Upload
              filesAvailable={filesAvailable}
              action={messageUploadFile(1)}
              description={user?.company_id ? undefined : description}
              icon={<ImageIcon />}
              descriptionFree={user?.company_id ? undefined : descriptionFree}
              accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
              fileList={attachments.list}
              setFileList={setFileList}
              defaultFileList={attachments.list}
              displayList
            />
          </Form.Item>
          <div className="form-bottom">
            {!user?.company_id && (
              <div className={cs("message-form__total", discountedDoctorPrice !== doctorPrice && "has-discount")}>
                <span>{t("wizard:total")}:</span>
                <span className="d-flex align-items-center">
                  <strong className="actual">{formatPrice(doctorPrice + attachments.price)}</strong>
                  {discountedDoctorPrice !== doctorPrice && (
                    <strong className="discounted">
                      {formatPrice(discountedDoctorPrice + attachments.discountedPrice)}
                    </strong>
                  )}
                </span>
              </div>
            )}
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
