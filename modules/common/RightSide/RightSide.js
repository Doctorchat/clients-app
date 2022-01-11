import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import BackTitle from "@/components/BackTitle";
import Sidebar from "@/components/Sidebar";
import { userRoles } from "@/context/constants";
import ClientInfo from "@/components/ClientInfo";

const DocInfo = dynamic(() => import("@/components/DocInfo"));

export default function RightSide(props) {
  const { userInfo, loading, selectedInvestigation } = props;
  const user = useSelector((store) => store.user);

  return (
    <div id="column-right">
      <Sidebar>
        <Sidebar.Header>
          <BackTitle title="Informație" />
        </Sidebar.Header>
        <Sidebar.Body>
          <div className="scrollable scrollable-y conversation-info-parts px-2">
            {userRoles.get("client") === user.data.role && (
              <DocInfo
                loading={loading}
                scrollableContainer="#column-right .conversation-info-parts"
                doctor={userInfo}
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
  );
}

RightSide.propTypes = {
  userInfo: PropTypes.object,
  loading: PropTypes.bool,
  selectedInvestigation: PropTypes.number,
};
