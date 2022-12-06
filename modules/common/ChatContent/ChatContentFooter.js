import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import MessageBar from "@/components/MessageBar";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

import ChatContentAccept from "./ChatContentAccept";

export default function ChatContentFooter(props) {
  const user = useSelector((store) => store.user);

  const { openMessageFormPopup, status, chatId, paymentUrl, type, isAccepted } = props;
  const { t } = useTranslation();

  const isAcceptedFalse = React.useMemo(
    () => type !== "support" && !isAccepted,
    [isAccepted, type]
  );

  const isMessageBarVisible = React.useMemo(() => {
    if (status && ["initied", "unpaid", "closed"].includes(status)) return false;
    if (user?.data?.role === userRoles.get("doctor") && isAcceptedFalse) return false;

    return true;
  }, [isAcceptedFalse, status, user?.data?.role]);

  return (
    <>
      <AuthRoleWrapper extraValidation={status === "initied"} roles={[userRoles.get("client")]}>
        <div className="chat-content-start w-100 d-flex justify-content-center">
          <Button type="text" onClick={openMessageFormPopup}>
            {t("start_conversation")}
          </Button>
        </div>
      </AuthRoleWrapper>
      <AuthRoleWrapper extraValidation={status === "unpaid"} roles={[userRoles.get("client")]}>
        <div className="chat-content-start w-100 d-flex justify-content-center">
          <a href={paymentUrl}>
            <Button type="text" className="confirm-cancel-btn">
              {t("pay")}
            </Button>
          </a>
        </div>
      </AuthRoleWrapper>

      <AuthRoleWrapper roles={[userRoles.get("doctor")]} extraValidation={isAcceptedFalse}>
        <ChatContentAccept chatId={chatId} />
      </AuthRoleWrapper>

      {isMessageBarVisible && <MessageBar chatId={chatId} status={status} type={type} />}
    </>
  );
}

ChatContentFooter.propTypes = {
  openMessageFormPopup: PropTypes.func,
  isInitiated: PropTypes.bool,
  chatId: PropTypes.string,
  status: PropTypes.string,
  paymentUrl: PropTypes.string,
  type: PropTypes.string,
  isAccepted: PropTypes.bool,
};

ChatContentFooter.defaultProps = {};
