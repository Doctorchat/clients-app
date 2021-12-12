import PropTypes from "prop-types";
import { memo } from "react";
import Image from "../Image/Image";
import cs from "@/utils/classNames";
import av2 from "@/imgs/2.jpg";
import LikeIcon from "@/icons/like.svg";
import ClockIcon from "@/icons/clock.svg";
import ShieldIcon from "@/icons/shield.svg";

const tagsConfig = {
  guard: {
    className: "guard",
    icon: <ShieldIcon />,
  },
};

function DocItem(props) {
  const {
    onClick,
    data: {
      isOnline,
      fullName,
      category,
      // avatar,
      meta: { likes, responseTime },
      tags,
    },
  } = props;

  return (
    <li className="doc-item" role="button" onClick={onClick}>
      <div className="doc-item-info">
        <div className={cs("dialog-avatar", isOnline && "is-online")}>
          <Image w="76" h="76" alt={fullName} src={av2.src} />
        </div>
        <div className="doc-caption">
          <h4 className="doc-title">{fullName}</h4>
          <p className="doc-category">{category}</p>
          <div className="doc-item-meta">
            <div className="doc-meta-item">
              <span className="icon like">
                <LikeIcon />
              </span>
              <span className="text">{likes}</span>
            </div>
            <div className="doc-meta-item">
              <span className="icon">
                <ClockIcon />
              </span>
              <span className="text">{responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="doc-tags">
        {tags.map((tag) => (
          <span key={tag} className={cs("doc-tag", tagsConfig[tag].className)}>
            {tagsConfig[tag].icon}
          </span>
        ))}
      </div>
    </li>
  );
}

DocItem.propTypes = {
  data: PropTypes.shape({
    isOnline: PropTypes.bool,
    fullName: PropTypes.string,
    category: PropTypes.string,
    avatar: PropTypes.string,
    meta: PropTypes.shape({
      likes: PropTypes.number,
      responseTime: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onClick: PropTypes.func,
};

DocItem.defaultProps = {
  data: {
    tags: [],
  },
};

export default memo(DocItem);
