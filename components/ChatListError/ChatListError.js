import PropTypes from "prop-types";
import { memo, forwardRef } from "react";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import WarnIcon from "@/icons/warn-duo.svg";

const ChatListError = forwardRef((props, ref) => (
  <div className="chatlist-error" ref={ref}>
    <div className="chatlist-error-icon">
      <WarnIcon />
    </div>
    <h3 className="chatlist-error-title">A apărut o eroare</h3>
    <p className="chatlist-error-descrp d-flex align-items-center">
      <Spinner className="mr-1" /> <span>Lucrăm...</span>
    </p>
    <Button className="chatlist-error-action" type="outline">
      Reload page
    </Button>
  </div>
));

ChatListError.propTypes = {
  ref: PropTypes.object,
};

ChatListError.displayName = "ChatListError";

export default memo(ChatListError);
