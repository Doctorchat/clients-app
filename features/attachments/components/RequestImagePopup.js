import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import { Textarea } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";

export const RequestImagePopup = React.memo((props) => {
  const { t } = useTranslation();

  const { isVisible, onConfirm, onCancel } = props;

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
        id="request-image-popup"
        visible={isVisible}
        onBeforeClose={onCancelHandler}
        onVisibleChange={(v) => {
          if (!v) onCancelHandler();
        }}
      >
        <div className="request-image-popup">
          <h3 className="request-image-popup__title">{t("chat_attach.request_file_title")}</h3>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minHeight={68}
            placeholder={t("chat_attach.request_file_text").concat("...")}
          />

          <div className="confirmation-popup__actions">
            <Button size="sm" type="outline" onClick={onCancelHandler}>
              {t("cancel")}
            </Button>
            <Button
              size="sm"
              onClick={onConfirmHandler}
              loading={isLoading}
              disabled={!description || description.length < 4}
            >
              {t("request")}
            </Button>
          </div>
        </div>
      </Popup>
    </Portal>
  );
});

RequestImagePopup.propTypes = {
  isVisible: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};
