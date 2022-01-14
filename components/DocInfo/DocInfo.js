import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Image from "../Image";
import Button from "../Button";
import Dropdown from "../Dropdown";
import Tooltip from "../Tooltip";
import Skeleton from "../Skeleton";
import Truncate from "../Truncate";
import DocInfoActivity from "./DocInfoActivity";
import DocReviews from "./DocReviews";
import DocInfoAbout from "./DocInfoAbout";
import Tabs, { Line } from "@/packages/Tabs";
import ShieldIcon from "@/icons/shield.svg";
import { docInfoTabs } from "@/context/TabsKeys";
import { ClientSelectMode } from "@/modules/client";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import { meetFormToggleVisibility } from "@/store/slices/meetFormSlice";

const selectedLng = localStorage.getItem("i18nextLng") || "ro";

export default function DocInfo(props) {
  const { doctor, scrollableContainer, allowCreate, loading } = props;
  const [tabsConfig, setTabsConfig] = useState({ key: docInfoTabs.activity, dir: "next" });
  const { t } = useTranslation();
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
    (type) => {
      if (type === "message") {
        dispatch(messageFormToggleVisibility(true));
      } else if (type === "meet") {
        dispatch(meetFormToggleVisibility(true));
      }
    },
    [dispatch]
  );

  return (
    <div className="doc-info">
      <div className="doc-info-top">
        <div className="dialog-avatar">
          <Image w="128" h="128" alt={doctor.name} src={doctor.avatar} />
        </div>
        <div className="doc-info-caption">
          <h4 className="title ellipsis">
            <span className="name ellipsis">{doctor.name}</span>
            {doctor.isNew && <span className="doc-title-tag new">{t("new")}</span>}
            {!doctor.isGuard && (
              <Tooltip title="Medic de gardă" placement="bottomCenter">
                <span className="doc-tag guard">
                  <ShieldIcon />
                </span>
              </Tooltip>
            )}
          </h4>
          <h6 className="category">
            {doctor?.category?.map((cat) => cat[`name_${selectedLng}`]).join(", ")}
          </h6>
          {loading ? (
            <Skeleton>
              <Skeleton.Line className="mb-1" w="93%" h="16px" />
              <Skeleton.Line className="mb-1" w="85%" h="16px" />
              <Skeleton.Line w="40%" h="16px" />
            </Skeleton>
          ) : (
            <p className="description mb-0">
              <Truncate text={doctor?.about?.bio} length={105} />
            </p>
          )}
          {allowCreate && (
            <div className="start-conversation mt-1 d-flex justify-content-end">
              <Dropdown
                overlay={<ClientSelectMode docId={doctor.id} onSelectMode={selectModeHandler} />}
                overlayClassName="choose-mode-overlay"
                placement="bottomLeft"
              >
                <Button size="sm" className="w-auto">
                  {t("describe_problem")}
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
      <div className="doc-info-tabs">
        <Line activeKey={tabsConfig.key} updateTabsConfig={updateTabsConfig}>
          <Line.Item title={t("activity")} dataKey={docInfoTabs.activity} />
          <Line.Item title={t("about")} dataKey={docInfoTabs.about} />
          <Line.Item title={t("reviews")} dataKey={docInfoTabs.reviews} />
        </Line>
        <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig} dataAnimation="tabs">
          <Tabs.Pane dataKey={docInfoTabs.activity} unmountOnExit={false} withAnimation={!loading}>
            <DocInfoActivity activity={doctor?.activity} loading={loading} />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.about} withAnimation={!loading}>
            <DocInfoAbout about={doctor?.about} loading={loading} />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.reviews} withAnimation={!loading}>
            <DocReviews docId={doctor?.id} />
          </Tabs.Pane>
        </Tabs>
      </div>
    </div>
  );
}

DocInfo.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    avatar: PropTypes.string,
    isGuard: PropTypes.bool,
    category: PropTypes.array,
    activity: PropTypes.object,
    about: PropTypes.object,
    isNew: PropTypes.bool,
  }),
  scrollableContainer: PropTypes.string,
  loading: PropTypes.bool,
  allowCreate: PropTypes.bool,
};

DocInfo.defaultProps = {
  doctor: {
    activity: {},
  },
  allowCreate: true,
};
