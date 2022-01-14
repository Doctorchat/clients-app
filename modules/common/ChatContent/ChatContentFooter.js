import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import MessageBar from "@/components/MessageBar";

export default function ChatContentFooter(props) {
  const { openMessageFormPopup, status, chatId, paymentUrl } = props;
  const { t } = useTranslation();

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
      {status && !["initied", "unpaid"].includes(status) && <MessageBar chatId={chatId} />}
    </>
  );
}

ChatContentFooter.propTypes = {
  openMessageFormPopup: PropTypes.func,
  isInitiated: PropTypes.bool,
  chatId: PropTypes.string,
  status: PropTypes.string,
  paymentUrl: PropTypes.string,
};

ChatContentFooter.defaultProps = {};
