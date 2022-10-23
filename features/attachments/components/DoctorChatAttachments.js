import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { IconBtn } from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import ClipIcon from "@/icons/clip.svg";
import UploadIcon from "@/icons/upload.svg";
import UploadPlusIcon from "@/icons/upload-plus.svg";

import { useRequestChatFileWithMutation, useUploadChatFileWithMutation } from "../hooks";
import { prepareFileForConfirmationModal } from "../utils";

import { AttachmentConfirmationPopup } from "./AttachmentConfirmationPopup";
import { AttachmentInputProvider, useAttachmentInput } from "./AttachmentInputProvider";
import { RequestImagePopup } from "./RequestImagePopup";

const OverlayUploadFile = React.memo(({ chatId }) => {
  const { t } = useTranslation();

  const { uploadFile } = useUploadChatFileWithMutation(chatId);
  const { temporaryFile, setTemporaryFile, triggerUploadInput } = useAttachmentInput();

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = React.useState(false);

  const onConfirmConfirmationPopup = React.useCallback(
    async (description) => {
      try {
        await uploadFile(temporaryFile, description);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      } finally {
        setTemporaryFile(null);
        setIsConfirmationPopupVisible(false);
      }
    },
    [setTemporaryFile, temporaryFile, uploadFile]
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
      <Menu.Item icon={<UploadIcon />} onClick={triggerUploadInput}>
        {t("chat_attach.upload_file")}
      </Menu.Item>
      <AttachmentConfirmationPopup
        isVisible={isConfirmationPopupVisible}
        file={prepareFileForConfirmationModal(temporaryFile)}
        onConfirm={onConfirmConfirmationPopup}
        onCancel={onCancelConfirmationPopup}
      />
    </>
  );
});

const OverlayRequestFile = React.memo(({ chatId }) => {
  const { t } = useTranslation();

  const { requestFile } = useRequestChatFileWithMutation(chatId);

  const [isRequestImagePopupVisible, setIsRequestImagePopupVisible] = React.useState(false);

  const onConfirmRequestImagePopup = React.useCallback(
    async (description) => {
      try {
        await requestFile(description);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      } finally {
        setIsRequestImagePopupVisible(false);
      }
    },
    [requestFile]
  );

  const onCancelRequestImagePopup = React.useCallback(() => {
    setIsRequestImagePopupVisible(false);
  }, []);

  return (
    <>
      <Menu.Item icon={<UploadPlusIcon />} onClick={() => setIsRequestImagePopupVisible(true)}>
        {t("chat_attach.request_file")}
      </Menu.Item>
      <RequestImagePopup
        isVisible={isRequestImagePopupVisible}
        onConfirm={onConfirmRequestImagePopup}
        onCancel={onCancelRequestImagePopup}
      />
    </>
  );
});

const DoctorChatAttachmentsRoot = (props) => {
  const { chatId } = props;

  return (
    <Dropdown
      className="chat-attachments-dropdown message-bar-attach"
      overlay={
        <Menu>
          <OverlayUploadFile chatId={chatId} />
          <OverlayRequestFile chatId={chatId} />
        </Menu>
      }
      placement="topRight"
    >
      <IconBtn icon={<ClipIcon />} size="sm" />
    </Dropdown>
  );
};

export const DoctorChatAttachments = ({ chatId }) => {
  return (
    <AttachmentInputProvider>
      <DoctorChatAttachmentsRoot chatId={chatId} />
    </AttachmentInputProvider>
  );
};

DoctorChatAttachments.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

DoctorChatAttachmentsRoot.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

OverlayUploadFile.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

OverlayRequestFile.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
