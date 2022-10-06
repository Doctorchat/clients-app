import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { t } from "i18next";
import PropTypes from "prop-types";

import Portal from "@/containers/Portal";
import cs from "@/utils/classNames";

import Button from "../Button";

export default function Confirm(props) {
  const {
    onConfirm,
    onCancel,
    className,
    confirmBtnProps,
    cancelBtnProps,
    content,
    cancelText,
    confirmText,
    isAsync,
    disabled,
    children,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [active, setActive] = useState(false);
  const confirmRef = useRef();

  const destroyConfirm = () => {
    setActive(false);
  };

  const onCancelHandler = () => {
    if (onCancel) onCancel();
    destroyConfirm();
  };

  const onConfirmHanlder = async () => {
    if (isAsync) {
      setConfirmLoading(true);
      try {
        await onConfirm();
      } catch (error) {
        Promise.reject(error);
      }
      setConfirmLoading(false);
    } else {
      onConfirm();
    }

    destroyConfirm();
  };

  const onConfirmOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setActive(true);
  };

  return (
    <>
      <a href="#" className={cs("confirm-trigger", disabled && "disabled")} onClick={onConfirmOpen}>
        {children}
      </a>
      <Portal portalName="modalRoot">
        <CSSTransition in={active} timeout={200} nodeRef={confirmRef} unmountOnExit>
          <div className={cs("confirm", className)} ref={confirmRef}>
            <div className="confirm-backdrop" role="banner" onClick={onCancelHandler} />
            <div className="confirm-body">
              <p className="confirm-content">{content}</p>
              <div className="confirm-actions d-flex justify-content-end">
                <Button type="text" onClick={onCancelHandler} {...cancelBtnProps}>
                  {cancelText}
                </Button>
                <Button
                  type="text"
                  loading={confirmLoading}
                  onClick={onConfirmHanlder}
                  className={cs("confirm-cancel-btn", "ms-2", confirmBtnProps?.className)}
                  {...confirmBtnProps}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        </CSSTransition>
      </Portal>
    </>
  );
}

Confirm.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  className: PropTypes.string,
  confirmBtnProps: PropTypes.object,
  cancelBtnProps: PropTypes.object,
  content: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  isAsync: PropTypes.bool,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  activateOnMount: PropTypes.bool,
};

Confirm.defaultProps = {
  confirmText: t("confirm"),
  cancelText: t("cancel"),
  isAsync: false,
  confirmBtnProps: {},
  cancelBtnProps: {},
};
