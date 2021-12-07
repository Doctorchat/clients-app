import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import LeftSide from "@/modules/common/LeftSide";
import AuthWrapper from "@/containers/AuthWrapper";
import Portal from "@/containers/Portal";

const ClientStartConversation = dynamic(() => import("@/modules/client/ClientStartConversation"));

export default function MainLayout({ children }) {
  return (
    <AuthWrapper>
      <Portal portalName="modalRoot">
        <ClientStartConversation />
      </Portal>
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
