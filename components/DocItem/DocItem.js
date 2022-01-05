import PropTypes from "prop-types";
import { memo } from "react";
import Image from "../Image";
import cs from "@/utils/classNames";
import HeartIcon from "@/icons/heart.svg";
import ClockIcon from "@/icons/clock.svg";
import ShieldIcon from "@/icons/shield.svg";
import LineIcon from "@/icons/line.svg";

function DocItem(props) {
  const {
    onClick,
    data: {
      isOnline,
      isGuard,
      isAvailable,
      isNew,
      fullName,
      category,
      avatar,
      meta: { helpedUsers, responseTime },
    },
  } = props;

  return (
    <li className={cs("doc-item", !isAvailable && "unavailable")} role="button" onClick={onClick}>
      <div className="doc-item-info">
        <div className={cs("dialog-avatar", isOnline && "is-online")}>
          <Image w="76" h="76" alt={fullName} src={avatar} />
        </div>
        <div className="doc-caption">
          <h4 className="doc-title">
            <span className="doc-name ellipsis">{fullName}</span>
            {isNew && <span className="doc-title-tag new">Nou</span>}
          </h4>
          <div className="doc-item-meta">
            <div className="doc-meta-item">
              <span className="icon like">
                <HeartIcon />
              </span>
              <span className="text">{helpedUsers || <LineIcon className="line-icon" />}</span>
            </div>
            <div className="doc-meta-item">
              <span className="icon">
                <ClockIcon />
              </span>
              <span className="text">{responseTime || <LineIcon className="line-icon" />}</span>
            </div>
          </div>
          <p className="doc-category">{category.join(", ")}</p>
        </div>
      </div>

      <div className="doc-tags">
        {isGuard && (
          <span className="doc-tag guard">
            <ShieldIcon />
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
    fullName: PropTypes.string,
    category: PropTypes.arrayOf(PropTypes.string),
    avatar: PropTypes.string,
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
