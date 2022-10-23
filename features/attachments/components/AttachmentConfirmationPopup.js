import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import { Textarea } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import FileIcon from "@/icons/file.svg";

export const AttachmentConfirmationPopup = React.memo((props) => {
  const { t } = useTranslation();

  const { isVisible, file, onConfirm, onCancel } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const onConfirmHandler = React.useCallback(async () => {
    setIsLoading(true);

    try {
      await onConfirm(description);
    } finally {
      setIsLoading(false);
      setDescription("");
    }
  }, [description, onConfirm]);

  const onCancelHandler = React.useCallback(() => {
    if (isLoading) return;

    onCancel();
    setDescription("");
  }, [onCancel, isLoading]);

  return (
    <Portal portalName="modalRoot">
      <Popup
        id="attach-confirmation-popup"
        visible={isVisible}
        onBeforeClose={onCancelHandler}
        onVisibleChange={(v) => {
          if (!v) onCancelHandler();
        }}
      >
        <div className="confirmation-popup">
          {file?.type === "image" && (
            <div className="confirmation-popup__preview">
              <img className="confirmation-popup__preview-image" alt={file.name} src={file.url} />
            </div>
          )}

          {file?.type === "document" && (
            <div className="confirmation-popup__document">
              <div className="confirmation-popup__document-icon">
                <FileIcon />
              </div>
              <div className="confirmation-popup__document-caption">
                <div className="confirmation-popup__document-name">{file.name}</div>
                <div className="confirmation-popup__document-meta">
                  <span>{file.extension}</span>
                  <span>{file.sizeFormatted}</span>
                </div>
              </div>
            </div>
          )}

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minHeight={44}
            placeholder={t("comments").concat("...")}
          />

          <div className="confirmation-popup__actions">
            <Button size="sm" type="outline" onClick={onCancelHandler}>
              {t("cancel")}
            </Button>
            <Button size="sm" onClick={onConfirmHandler} loading={isLoading}>
              {t("add")}
            </Button>
          </div>
        </div>
      </Popup>
    </Portal>
  );
});

AttachmentConfirmationPopup.propTypes = {
  isVisible: PropTypes.bool,
  file: PropTypes.oneOfType([
    PropTypes.shape({
      type: PropTypes.oneOf(["image", "document"]),
      name: PropTypes.string,
      url: PropTypes.string,
    }),
    PropTypes.shape({
      type: PropTypes.oneOf(["image", "document"]),
      name: PropTypes.string,
      extension: PropTypes.string,
      size: PropTypes.number,
      sizeFormatted: PropTypes.string,
    }),
  ]),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};
