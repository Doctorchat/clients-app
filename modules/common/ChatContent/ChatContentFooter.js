import PropTypes from "prop-types";
import Button from "@/components/Button";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import MessageBar from "@/components/MessageBar";

export default function ChatContentFooter(props) {
  const { openMessageFormPopup, status, chatId } = props;

  return (
    <>
      <AuthRoleWrapper extraValidation={status === "initied"} roles={[userRoles.get("client")]}>
        <div className="chat-content-start w-100 d-flex justify-content-center">
          <Button type="text" onClick={openMessageFormPopup}>
            Începe Conversația
          </Button>
        </div>
      </AuthRoleWrapper>
      {status && status !== "initied" && <MessageBar chatId={chatId} />}
    </>
  );
}

ChatContentFooter.propTypes = {
  openMessageFormPopup: PropTypes.func,
  isInitiated: PropTypes.bool,
  chatId: PropTypes.string,
  status: PropTypes.string,
};

ChatContentFooter.defaultProps = {};
