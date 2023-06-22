import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { IconBtn } from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import ClipIcon from "@/icons/clip.svg";
import ClipboardDocumentIcon from "@/icons/clipboard-document.svg";
import UploadIcon from "@/icons/upload.svg";
import UploadPlusIcon from "@/icons/upload-plus.svg";
import { DocMessageTemplate } from "@/modules/doctor";

import { useRequestFile, useUploadFile } from "../hooks";
import { prepareFileForConfirmationModal } from "../utils";

import { AttachmentConfirmationPopup } from "./AttachmentConfirmationPopup";
import { AttachmentInputProvider, useAttachmentInput } from "./AttachmentInputProvider";
import { RequestImagePopup } from "./RequestImagePopup";

const OverlayUploadFile = React.memo(() => {
  const { t } = useTranslation();
  const { chatId } = React.useContext(DoctorChatAttachmentsContext);
  const { uploadFreeFile } = useUploadFile(chatId);
  const { temporaryFile, setTemporaryFile, triggerUploadInput } = useAttachmentInput();

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = React.useState(false);

  const onConfirmConfirmationPopup = React.useCallback(
    async (description) => {
      try {
        await uploadFreeFile(temporaryFile, description);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      } finally {
        setTemporaryFile(null);
        setIsConfirmationPopupVisible(false);
      }
    },
    [setTemporaryFile, temporaryFile, uploadFreeFile]
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

const OverlayRequestFile = React.memo(() => {
  const { t } = useTranslation();
  const { chatId } = React.useContext(DoctorChatAttachmentsContext);
  const { requestFile } = useRequestFile(chatId);

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

const OverlaySelectTemplate = React.memo(() => {
  const { t } = useTranslation();
  const { onUpdateMessageBarContent } = React.useContext(DoctorChatAttachmentsContext);

  const [isTemplatePopupVisible, setIsTemplatePopupVisible] = React.useState(false);

  return (
    <>
      <Menu.Item icon={<ClipboardDocumentIcon />} onClick={() => setIsTemplatePopupVisible(true)}>
        {t("chat_attach.select_template")}
      </Menu.Item>
      <DocMessageTemplate
        isOpen={isTemplatePopupVisible}
        onClose={() => setIsTemplatePopupVisible(false)}
        onChooseTemplate={(template) => {
          setIsTemplatePopupVisible(false);
          onUpdateMessageBarContent(template?.content);
        }}
      />
    </>
  );
});

export const DoctorChatAttachmentsContext = React.createContext(null);

export const DoctorChatAttachments = ({ chatId, onUpdateMessageBarContent }) => {
  return (
    <AttachmentInputProvider>
      <DoctorChatAttachmentsContext.Provider value={{ chatId, onUpdateMessageBarContent }}>
        <Dropdown
          className="chat-attachments-dropdown message-bar-attach"
          overlay={
            <Menu>
              <OverlayUploadFile />
              <OverlayRequestFile />
              <OverlaySelectTemplate />
            </Menu>
          }
          placement="topRight"
        >
          <IconBtn icon={<ClipIcon />} size="sm" />
        </Dropdown>
      </DoctorChatAttachmentsContext.Provider>
    </AttachmentInputProvider>
  );
};

DoctorChatAttachments.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onUpdateMessageBarContent: PropTypes.func,
};

OverlayUploadFile.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

OverlayRequestFile.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
