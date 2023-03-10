import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { docInfoTabs } from "@/context/TabsKeys";
import { ClientSelectMode } from "@/modules/client";
import Tabs, { Line } from "@/packages/Tabs";
import { meetFormToggleVisibility } from "@/store/slices/meetFormSlice";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";
import getPropByLangOrThrow from "@/utils/getPropByLangOrThrow";

import Button from "../Button";
import Dropdown from "../Dropdown";
import Image from "../Image";
import Skeleton from "../Skeleton";
import Truncate from "../Truncate";

import DocInfoAbout from "./DocInfoAbout";
import DocInfoActivity from "./DocInfoActivity";
import DocReviews from "./DocReviews";

const selectedLng = getActiveLng();

export default function DocInfo(props) {
  const { doctor, scrollableContainer, allowCreate, loading, actionBtn, reviewsAction } = props;
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
    <div className={cs("doc-info", !doctor.isAvailable && "unavailable")}>
      <div className="doc-info-top">
        <div className="dialog-avatar">
          <Image w="128" h="128" alt={doctor.name} src={doctor.avatar} />
        </div>
        <div className="doc-info-caption">
          <h4 className="title ellipsis">
            <span className="name ellipsis">{doctor.name}</span>
            {doctor.isNew && <span className="doc-title-tag new">{t("new")}</span>}
          </h4>
          {doctor.isAvailable ? (
            <>
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
                  <Truncate
                    text={getPropByLangOrThrow(doctor?.about?.bio, selectedLng)}
                    length={105}
                    onReadMore={updateTabsConfig(docInfoTabs.about)}
                  />
                </p>
              )}
            </>
          ) : (
            <p className="mb-0 doc-unavailable-msg">{t("doctor_unavailable")}</p>
          )}
          {allowCreate && (
            <div className="start-conversation mt-1 d-flex justify-content-end">
              <Dropdown
                overlay={
                  <ClientSelectMode
                    docId={doctor.id}
                    isTextVisible={doctor.chat}
                    isVideoVisible={doctor.video}
                    onSelectMode={selectModeHandler}
                  />
                }
                overlayClassName="choose-mode-overlay"
                placement="bottomLeft"
              >
                <Button size="sm" className="w-auto">
                  {t("describe_problem")}
                </Button>
              </Dropdown>
            </div>
          )}
          {actionBtn && actionBtn}
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
            <DocInfoActivity
              isGuard={doctor?.isGuard}
              activity={doctor?.activity}
              loading={loading}
            />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.about} withAnimation={!loading}>
            <DocInfoAbout about={doctor?.about} loading={loading} />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.reviews} withAnimation={!loading}>
            <DocReviews docId={doctor?.id} reviewsAction={reviewsAction} />
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
    isAvailable: PropTypes.bool,
    chat: PropTypes.bool,
    video: PropTypes.bool,
  }),
  scrollableContainer: PropTypes.string,
  loading: PropTypes.bool,
  allowCreate: PropTypes.bool,
  actionBtn: PropTypes.element,
  reviewsAction: PropTypes.func,
};

DocInfo.defaultProps = {
  doctor: {
    activity: {},
  },
  allowCreate: true,
};
