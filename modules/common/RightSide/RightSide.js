import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

import BackTitle from "@/components/BackTitle";
import { IconBtn } from "@/components/Button";
import ClientInfo from "@/components/ClientInfo";
import Sidebar from "@/components/Sidebar";
import { userRoles } from "@/context/constants";
import TimesIcon from "@/icons/times.svg";
import { chatContentToggleInfoVisibility } from "@/store/slices/chatContentSlice";

const DocInfo = dynamic(() => import("@/components/DocInfo"));

export default function RightSide(props) {
  const { userInfo, loading, selectedInvestigation } = props;
  const { user, infoVisible } = useSelector((store) => ({
    user: store.user,
    infoVisible: store.chatContent.infoVisible,
  }));
  const { t } = useTranslation();
  const columnRef = useRef();
  const dispatch = useDispatch();

  const closeChatInfo = useCallback(
    () => dispatch(chatContentToggleInfoVisibility({ visible: false, animate: true })),
    [dispatch]
  );

  return (
    <CSSTransition in={infoVisible.visible} timeout={infoVisible.animate ? 200 : 0} nodeRef={columnRef} unmountOnExit>
      <div id="column-right" ref={columnRef}>
        <Sidebar>
          <Sidebar.Header>
            <BackTitle
              title={
                <div className="column-right-title">
                  <span>{t("information")}</span>
                  <IconBtn icon={<TimesIcon />} onClick={closeChatInfo} />
                </div>
              }
            />
          </Sidebar.Header>
          <Sidebar.Body>
            <div className="scrollable scrollable-y conversation-info-parts px-2">
              {userRoles.get("client") === user.data.role && (
                <DocInfo
                  loading={loading}
                  scrollableContainer="#column-right .conversation-info-parts"
                  doctor={userInfo}
                  allowCreate={false}
                />
              )}
              {userRoles.get("doctor") === user.data.role && (
                <ClientInfo
                  client={userInfo}
                  selectedInvestigation={selectedInvestigation}
                  loading={loading || !selectedInvestigation}
                />
              )}
            </div>
          </Sidebar.Body>
        </Sidebar>
      </div>
    </CSSTransition>
  );
}

RightSide.propTypes = {
  userInfo: PropTypes.object,
  loading: PropTypes.bool,
  selectedInvestigation: PropTypes.number,
};
