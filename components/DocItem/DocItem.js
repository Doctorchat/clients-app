import { memo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import LineIcon from "@/icons/line.svg";
import ShieldIcon from "@/icons/shield.svg";
import VideoIcon from "@/icons/video.svg";
import cs from "@/utils/classNames";
import useCurrency from "@/hooks/useCurrency";

import DcTooltip from "../DcTooltip";
import Image from "../Image";

function DocItem(props) {
  const {
    onClick,
    data: {
      isOnline,
      isGuard,
      isAvailable,
      isNew,
      name,
      category,
      avatar,
      price: { video, text },
      meta: { responseTime },
    },
  } = props;
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();


  return (
    <li className={cs("doc-item", !isAvailable && "unavailable")} role="button" onClick={onClick}>
      <div className="doc-item-info">
        <div className={cs("dialog-avatar", isOnline && "is-online")}>
          <Image w="76" h="76" alt={name} src={avatar} />
        </div>
        <div className="doc-caption">
          <h4 className="doc-title">
            <span className="doc-name ellipsis">{name}</span>
            {isNew && <span className="doc-title-tag new">Nou</span>}
          </h4>
          {isAvailable ? (
            <>
              <div className="doc-item-meta">
                <div className="doc-meta-item">
                  <span className="icon">
                    <ClockIcon />
                  </span>
                  <span className="text">
                    {responseTime ? (
                      `${responseTime} ${t("mins")}`
                    ) : (
                      <LineIcon className="line-icon" />
                    )}
                  </span>
                </div>
              </div>
              <p className="doc-category">{category.join(", ")}</p>
            </>
          ) : (
            <p className="mb-0 doc-unavailable-msg">{t("doctor_unavailable")}</p>
          )}
          <div className="doc-price d-flex align-items-center">
            <div className="text d-flex align-items-center">
              <CommentIcon />
              <span>{text} {globalCurrency}</span>
            </div>
            <div className="video d-flex align-items-center">
              <VideoIcon />
              <span>{video} {globalCurrency}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="doc-tags">
        {isGuard && (
          <span className="doc-tag guard">
            <DcTooltip side="top" align="end" content={t("guard_doctor")}>
              <ShieldIcon />
            </DcTooltip>
          </span>
        )}
      </div>
    </li>
  );
}

DocItem.propTypes = {
  data: PropTypes.shape({
    isOnline: PropTypes.bool,
    isGuard: PropTypes.bool,
    isAvailable: PropTypes.bool,
    isNew: PropTypes.bool,
    name: PropTypes.string,
    category: PropTypes.arrayOf(PropTypes.string),
    avatar: PropTypes.string,
    price: PropTypes.shape({
      text: PropTypes.number,
      video: PropTypes.number,
    }),
    meta: PropTypes.shape({
      helpedUsers: PropTypes.number,
      responseTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
  onClick: PropTypes.func,
};

DocItem.defaultProps = {
  data: {
    tags: [],
  },
};

export default memo(DocItem);
