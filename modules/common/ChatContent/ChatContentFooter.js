import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import MessageBar from "@/components/MessageBar";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

import ChatContentAccept from "./ChatContentAccept";
import ChatContentPayment from "./ChatContentPayment";

export default function ChatContentFooter(props) {
  const router = useRouter();
  const user = useSelector((store) => store.user);

  const { status, chatId, paymentUrl, price, type, isAccepted, isMeet, userInfo, hasExpiredMessage } = props;
  const { t } = useTranslation();

  const redirectToRegistrationFlow = React.useCallback(() => {
    const messageType = isMeet ? "meet" : "standard";
    const url = `/registration-flow/message/${chatId}?chatType=${type}&messageType=${messageType}&doctorId=${
      userInfo?.id ?? "auto"
    }`;

    router.push(url);
  }, [chatId, isMeet, router, type, userInfo?.id]);

  const isChatContentAcceptVisible = React.useMemo(() => {
    if (status && ["initied", "unpaid", "closed"].includes(status)) return false;
    if (type === "support") return false;
    if (isAccepted === false) return true;

    return false;
  }, [isAccepted, status, type]);

  const isMessageBarVisible = React.useMemo(() => {
    if (status && ["initied", "unpaid", "closed"].includes(status)) return false;
    if (user?.data?.role === userRoles.get("doctor") && isAccepted === false) return false;

    return true;
  }, [isAccepted, status, user?.data?.role]);

  return (
    <>
      <AuthRoleWrapper extraValidation={status && status === "initied"} roles={[userRoles.get("client")]}>
        <div className="chat-content-start w-100 d-flex justify-content-center">
          <Button type="text" onClick={redirectToRegistrationFlow}>
            {t("start_conversation")}
          </Button>
        </div>
      </AuthRoleWrapper>

      <AuthRoleWrapper extraValidation={userInfo?.id && hasExpiredMessage} roles={[userRoles.get("client")]}>
        <div className="chat-content-start w-100 d-flex justify-content-center">
          <Button type="text" onClick={() => router.push(`/registration-flow/select-doctor?doctor_id=${userInfo?.id}`)}>
            {t("repeated_reservation")}
          </Button>
        </div>
      </AuthRoleWrapper>

      <AuthRoleWrapper
        extraValidation={hasExpiredMessage === false && status && status === "unpaid"}
        roles={[userRoles.get("client")]}
      >
        <ChatContentPayment paymentUrl={paymentUrl} price={price} />
      </AuthRoleWrapper>

      <AuthRoleWrapper extraValidation={isChatContentAcceptVisible} roles={[userRoles.get("doctor")]}>
        <ChatContentAccept chatId={chatId} />
      </AuthRoleWrapper>

      {isMessageBarVisible && <MessageBar chatId={chatId} status={status} type={type} />}
    </>
  );
}

ChatContentFooter.propTypes = {
  isInitiated: PropTypes.bool,
  chatId: PropTypes.string,
  status: PropTypes.string,
  paymentUrl: PropTypes.string,
  price: PropTypes.number,
  type: PropTypes.string,
  isAccepted: PropTypes.bool,
  isMeet: PropTypes.bool,
  userInfo: PropTypes.object,
  hasExpiredMessage: PropTypes.bool,
};

ChatContentFooter.defaultProps = {};
