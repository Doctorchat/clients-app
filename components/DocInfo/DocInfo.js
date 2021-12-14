import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "../Image/Image";
import Button from "../Button";
import Dropdown from "../Dropdown";
import Tooltip from "../Tooltip";
import Skeleton from "../Skeleton";
import Truncate from "../Truncate";
import DocInfoActivity from "./DocInfoActivity";
import DocInfoReviews from "./DocInfoReviews";
import DocInfoAbout from "./DocInfoAbout";
import Tabs, { Line } from "@/packages/Tabs";
import ShieldIcon from "@/icons/shield.svg";
import { docInfoTabs } from "@/context/TabsKeys";
import { ClientSelectMode } from "@/modules/client";
import { messageFormTogglePopupVisibility } from "@/store/slices/messageFormSlice";

export default function DocInfo(props) {
  const { doctor, scrollableContainer, loading } = props;
  const [tabsConfig, setTabsConfig] = useState({ key: docInfoTabs.activity, dir: "next" });
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });

        if (scrollableContainer) {
          document.querySelector(scrollableContainer).scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      },
    [scrollableContainer]
  );

  const selectModeHandler = useCallback(
    (type) => () => {
      if (type === "message") {
        dispatch(messageFormTogglePopupVisibility(true));
      }
    },
    [dispatch]
  );

  return (
    <div className="doc-info">
      <div className="doc-info-top">
        <div className="dialog-avatar">
          <Image w="128" h="128" alt={doctor.fullName} src={doctor.avatar} />
        </div>
        <div className="doc-info-caption">
          <h4 className="title">
            <span className="name">{doctor.fullName}</span>
            <span className="doc-title-tag new">Nou</span>
            {!doctor.isGuard && (
              <Tooltip title="Medic de gardă" placement="rightCenter">
                <span className="doc-tag guard">
                  <ShieldIcon />
                </span>
              </Tooltip>
            )}
          </h4>
          <h6 className="category">{doctor?.category?.join(", ")}</h6>
          {loading ? (
            <Skeleton>
              <Skeleton.Line className="mb-1" w="93%" h="20px" />
              <Skeleton.Line className="mb-1" w="85%" h="20px" />
              <Skeleton.Line w="40%" h="20px" />
            </Skeleton>
          ) : (
            <p className="description mb-0">
              <Truncate text={doctor?.about?.bio} length={105} />
            </p>
          )}

          <div className="start-conversation d-flex justify-content-end">
            <Dropdown
              overlay={<ClientSelectMode onItemClick={selectModeHandler} />}
              overlayClassName="choose-mode-overlay"
              placement="topLeft"
            >
              <Button size="sm" className="w-auto">
                Descrie Problema
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="doc-info-tabs">
        <Line activeKey={tabsConfig.key} updateTabsConfig={updateTabsConfig}>
          <Line.Item title="Activitate" dataKey={docInfoTabs.activity} />
          <Line.Item title="Despre" dataKey={docInfoTabs.about} />
          <Line.Item title="Recenzii" dataKey={docInfoTabs.reviews} />
        </Line>
        <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig} dataAnimation="tabs">
          <Tabs.Pane dataKey={docInfoTabs.activity} unmountOnExit={false}>
            <DocInfoActivity activity={doctor?.activity} loading={loading} />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.about}>
            <DocInfoAbout about={doctor?.about} loading={loading} />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.reviews}>
            <DocInfoReviews docId={doctor?.id} />
          </Tabs.Pane>
        </Tabs>
      </div>
    </div>
  );
}

DocInfo.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    avatar: PropTypes.string,
    isGuard: PropTypes.bool,
    category: PropTypes.array,
    activity: PropTypes.object,
    about: PropTypes.object,
  }),
  scrollableContainer: PropTypes.string,
  loading: PropTypes.bool,
};

DocInfo.defaultProps = {
  doctor: {
    activity: {},
  },
};
