import { useDispatch } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";

import { userRoles } from "@/context/constants";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { WalletBalance } from "@/modules/common/Wallet/elements/index";
import { WalletTopup } from "@/modules/common/Wallet";
import Button from "@/components/Button";
import { toggleTopUpModal } from "@/store/slices/userSlice";

const WalletFastTopUp = ({ className }) => {
  const dispatch = useDispatch();

  return (
    <AuthRoleWrapper roles={[userRoles.get("client")]}>
      <div className={clsx("d-flex", className)}>
        <WalletBalance showFrozen={false} />
        <WalletTopup popupClassName="red-brand-colors" />
        <Button
          className="m-3 mb-2 p-0"
          style={{ minWidth: 32, minHeight: 32 }}
          size="sm"
          onClick={() => dispatch(toggleTopUpModal(true))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v6H4v6h10v2H4ZM4 8h16V6H4v2Zm15 14v-3h-3v-2h3v-3h2v3h3v2h-3v3h-2ZM4 18V6v12Z"
            />
          </svg>
        </Button>
      </div>
    </AuthRoleWrapper>
  );
};
WalletFastTopUp.propTypes = {
  className: PropTypes.string,
};
WalletFastTopUp.defaultProps = {
  className: "",
};
export default WalletFastTopUp;
