import PropTypes from "prop-types";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../Button";
import Dropdown from "../Dropdown";
import Tooltip from "../Tooltip";
import DocInfoSummary from "./DocInfoSummary";
import DocInfoReviews from "./DocInfoReviews";
import Tabs, { Line } from "@/packages/Tabs";
import ShieldIcon from "@/icons/shield.svg";
import av2 from "@/imgs/2.jpg";
import { docInfoTabs } from "@/context/TabsKeys";
import { ClientSelectMode } from "@/modules/client";
import { messageFormTogglePopupVisibility } from "@/store/slices/messageFormSlice";

export default function DocInfo(props) {
  const { doctor, scrollableContainer } = props;
  const [tabsConfig, setTabsConfig] = useState({ key: docInfoTabs.summary, dir: "next" });
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
          <Image
            blurDataURL={av2.blurDataURL}
            src={av2.src}
            alt={"Novac Denis"}
            width="128"
            height="128"
          />
        </div>
        <div className="doc-info-caption">
          <h4 className="title">
            <span className="name">Denis Novac</span>
            <Tooltip title="Medic de gardă" placement="rightCenter">
              <span className="doc-tag guard">
                <ShieldIcon />
              </span>
            </Tooltip>
          </h4>
          <h6 className="category">Programatolog</h6>
          <p className="description mb-0">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industrys...
          </p>
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
          <Line.Item title="Activitate" dataKey={docInfoTabs.summary} />
          <Line.Item title="Aprecieri" dataKey={docInfoTabs.reviews} />
        </Line>
        <Tabs config={{ ...tabsConfig }} updateTabsConfig={updateTabsConfig} dataAnimation="tabs">
          <Tabs.Pane dataKey={docInfoTabs.summary} unmountOnExit={false}>
            <DocInfoSummary />
          </Tabs.Pane>
          <Tabs.Pane dataKey={docInfoTabs.reviews}>
            <DocInfoReviews />
          </Tabs.Pane>
        </Tabs>
      </div>
    </div>
  );
}

DocInfo.propTypes = {
  doctor: PropTypes.shape({
    fullName: PropTypes.string,
  }),
  scrollableContainer: PropTypes.string,
};

DocInfo.defaultProps = {};
