import dynamic from "next/dynamic";
import PropTypes from "prop-types";

import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import AuthWrapper from "@/containers/AuthWrapper";
import Portal from "@/containers/Portal";
import { userRoles } from "@/context/constants";
import { LeftSide, PhoneConfirmation } from "@/modules/common";
import { DocStartConversation } from "@/modules/doctor";

const ClientStartConversation = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientStartConversation)
);
const ClientMessageForm = dynamic(() => import("@/modules/client").then((response) => response.ClientMessageForm));
const ClientMeetForm = dynamic(() => import("@/modules/client").then((response) => response.ClientMeetForm));
const ClientInvestigationForm = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientInvestigationForm)
);

export default function MainLayout({ children }) {
  return (
    <AuthWrapper>
      <Portal portalName="modalRoot">
        <PhoneConfirmation />
      </Portal>

      <AuthRoleWrapper roles={[userRoles.get("client")]}>
        <Portal portalName="modalRoot">
          <ClientStartConversation />
          <ClientMessageForm />
          <ClientMeetForm />
          <ClientInvestigationForm />
        </Portal>
      </AuthRoleWrapper>

      <AuthRoleWrapper roles={[userRoles.get("doctor")]}>
        <Portal portalName="modalRoot">
          <DocStartConversation />
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
