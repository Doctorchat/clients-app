import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import Popup from "@/components/Popup";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import AuthWrapper from "@/containers/AuthWrapper";
import Portal from "@/containers/Portal";
import { userRoles } from "@/context/constants";
import useRegion from "@/hooks/useRegion";
import ArrowRightIcon from "@/icons/arrow-right.svg";
import { LeftSide, PhoneConfirmation } from "@/modules/common";

const ClientStartConversation = dynamic(() =>
  import("@/modules/client").then((response) => response.ClientStartConversation)
);
const ClientMessageForm = dynamic(() => import("@/modules/client").then((response) => response.ClientMessageForm));
const ClientMeetForm = dynamic(() => import("@/modules/client").then((response) => response.ClientMeetForm));

export default function MainLayout({ children }) {
  const region = useRegion();
  const { t } = useTranslation();
  
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
        </Portal>
      </AuthRoleWrapper>

      <AuthRoleWrapper roles={[userRoles.get("doctor")]}>
        <Popup id="redirect" visible={true}>
          <Popup.Header title={t("new_website")} />
          <Popup.Content>
            <p className="mb-0" style={{ textIndent: "1.5em" }}>
              {t("new_website_description")}
            </p>
            <div className="d-flex justify-content-center">
              <Button
                className="w-auto"
                onClick={() => window.open(`https://chat.doctorchat.${region==='online'?'ro':region}`, "_blank", "noopener")}
              >
                <ArrowRightIcon />
                {t("new_website_doctors")}
              </Button>
            </div>
            <div className="justify-content-end d-flex align-items-center h-full w-full  bg-redirect-site" />
          </Popup.Content>
        </Popup>
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
