import PropTypes from "prop-types";
import DocInfo from "@/components/DocInfo";
import BackTitle from "@/components/BackTitle";
import Sidebar from "@/components/Sidebar";

export default function RightSide(props) {
  const { userInfo, loading } = props;

  return (
    <div id="column-right">
      <Sidebar>
        <Sidebar.Header>
          <BackTitle title="Informație" />
        </Sidebar.Header>
        <Sidebar.Body>
          <div className="scrollable scrollable-y conversation-info-parts px-2">
            <DocInfo
              loading={loading}
              scrollableContainer="#column-right .conversation-info-parts"
              doctor={userInfo}
            />
          </div>
        </Sidebar.Body>
      </Sidebar>
    </div>
  );
}

RightSide.propTypes = {
  userInfo: PropTypes.object,
  loading: PropTypes.bool,
};
