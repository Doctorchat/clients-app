import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import Alert from "@/components/Alert";
import Button, { IconBtn } from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import ClipIcon from "@/icons/clip.svg";
import UploadIcon from "@/icons/upload.svg";
import api from "@/services/axios/api";
import { toggleTopUpModal } from "@/store/slices/userSlice";

import { useUploadFile } from "../hooks";
import { prepareFileForConfirmationModal } from "../utils";

import { AttachmentConfirmationPopup } from "./AttachmentConfirmationPopup";
import { AttachmentInputProvider, useAttachmentInput } from "./AttachmentInputProvider";

const Overlay = React.memo(({ isFree }) => {
  const { t } = useTranslation();

  const { triggerUploadInput } = useAttachmentInput();

  const { attachPrice } = useSelector((store) => ({
    attachPrice: store.bootstrap.payload?.global?.attach,
  }));

  const { data: walletData } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
  });

  const dispatch = useDispatch();

  if (!isFree && walletData?.data?.balance < attachPrice) {
    return (
      <div className="px-2">
        <Alert
          className="configure-form-alert"
          type="error"
          message={t("chat_attach.insufficient_funds")}
        />
        <Button size="sm" className="mt-2" onClick={() => dispatch(toggleTopUpModal(true))}>
          {t("chat_attach.replenish_balance")}
        </Button>
      </div>
    );
  }

  return (
    <Menu>
      <Menu.Item icon={<UploadIcon />} onClick={triggerUploadInput}>
        {t("chat_attach.upload_file")}
      </Menu.Item>
      {!isFree && (
        <span className="text-muted px-2 mt-2 d-block text-sm text-center">
          {t("chat_attach.you_will_be_charged", { price: attachPrice })}
        </span>
      )}
    </Menu>
  );
});

const ClientChatAttachmentsRoot = (props) => {
  const { isFree = false, chatId } = props;

  const { temporaryFile, setTemporaryFile } = useAttachmentInput();
  const { uploadFreeFile, uploadPaidFile } = useUploadFile(chatId);

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = React.useState(false);

  const onConfirmConfirmationPopup = React.useCallback(
    async (description) => {
      try {
        if (isFree) {
          await uploadFreeFile(temporaryFile, description);
        } else {
          await uploadPaidFile(temporaryFile, description);
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      } finally {
        setTemporaryFile(null);
        setIsConfirmationPopupVisible(false);
      }
    },
    [setTemporaryFile, temporaryFile, isFree, uploadFreeFile, uploadPaidFile]
  );

  const onCancelConfirmationPopup = React.useCallback(() => {
    setIsConfirmationPopupVisible(false);
    setTimeout(() => setTemporaryFile(null), 300);
  }, [setTemporaryFile]);

  React.useEffect(() => {
    if (temporaryFile) {
      setIsConfirmationPopupVisible(true);
    }
  }, [temporaryFile]);

  return (
    <>
      <Dropdown
        className="chat-attachments-dropdown message-bar-attach"
        overlay={<Overlay isFree={isFree} />}
        placement="topRight"
      >
        <IconBtn icon={<ClipIcon />} size="sm" />
      </Dropdown>
      <AttachmentConfirmationPopup
        isVisible={isConfirmationPopupVisible}
        file={prepareFileForConfirmationModal(temporaryFile)}
        onConfirm={onConfirmConfirmationPopup}
        onCancel={onCancelConfirmationPopup}
      />
    </>
  );
};

export const ClientChatAttachments = ({ isFree, chatId }) => {
  return (
    <AttachmentInputProvider>
      <ClientChatAttachmentsRoot isFree={isFree} chatId={chatId} />
    </AttachmentInputProvider>
  );
};

ClientChatAttachments.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFree: PropTypes.bool,
};

ClientChatAttachmentsRoot.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isFree: PropTypes.bool,
};

Overlay.propTypes = {
  isFree: PropTypes.bool,
};
