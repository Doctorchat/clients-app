import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import LeftSide from "@/modules/common/LeftSide";
import AuthWrapper from "@/containers/AuthWrapper";
import Portal from "@/containers/Portal";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

const ClientStartConversation = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientStartConversation)
);
const ClientMessageForm = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientMessageForm)
);

export default function MainLayout({ children }) {
  return (
    <AuthWrapper>
      <AuthRoleWrapper roles={[userRoles.get("client")]}>
        <Portal portalName="modalRoot">
          <ClientStartConversation />
          <ClientMessageForm />
        </Portal>
      </AuthRoleWrapper>
      <div id="chat-columns">
        <LeftSide />
        {children}
      </div>
    </AuthWrapper>
  );
}

MainLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
