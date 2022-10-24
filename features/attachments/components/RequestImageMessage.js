import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import BelOnIcon from "@/icons/bel-on.svg";
import PlusIcon from "@/icons/plus.svg";

import { useUploadFile } from "../hooks";
import { prepareFileForConfirmationModal } from "../utils";

import { AttachmentConfirmationPopup } from "./AttachmentConfirmationPopup";
import { AttachmentInputProvider, useAttachmentInput } from "./AttachmentInputProvider";

const RequestImageMessageRoot = React.memo((props) => {
  const { t } = useTranslation();

  const { chatId } = props;

  const { temporaryFile, setTemporaryFile } = useAttachmentInput();
  const { uploadFreeFile } = useUploadFile(chatId);

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

  return (
    <>
      <div className="request-image">
        <div className="request-image__header">
          <h3 className="request-image__title">
            <BelOnIcon />
            {t("chat_attach.request_to_upload_file")}
          </h3>
          <p className="request-image__description">
            Aici trebuie description de la doctor. Clientul cum sa stie ce imagine sa incarce?
          </p>
        </div>
        <div className="request-image__actions">
          <Button icon={<PlusIcon />}>{t("chat_attach.upload_file")}</Button>
        </div>
      </div>
      <AttachmentConfirmationPopup
        isVisible={isConfirmationPopupVisible}
        file={prepareFileForConfirmationModal(temporaryFile)}
        onConfirm={onConfirmConfirmationPopup}
        onCancel={onCancelConfirmationPopup}
      />
    </>
  );
});

export const RequestImageMessage = ({ chatId }) => {
  return (
    <AttachmentInputProvider>
      <RequestImageMessageRoot chatId={chatId} />
    </AttachmentInputProvider>
  );
};

RequestImageMessage.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

RequestImageMessageRoot.propTypes = {
  chatId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
