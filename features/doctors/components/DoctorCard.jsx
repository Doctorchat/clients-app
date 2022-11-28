import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import ArrowRightIcon from "@/icons/arrow-right.svg";
import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import ShieldIcon from "@/icons/shield.svg";
import VideoIcon from "@/icons/video.svg";

export const DoctorCard = ({ avatar, name, price, category = [], meta, isGuard }) => {
  const { t } = useTranslation();

  return (
    <article className="doctor-card">
      <div className="doctor-card__avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="doctor-card__caption">
        <header className="doctor-card__header">
          <p className="doctor-card__experience">15 Ani</p>
          <h3 className="doctor-card__name">{name}</h3>
          <h4 className="doctor-card__category">{category.join(", ")}</h4>
        </header>
        <div className="doctor-card__meta">
          {isGuard && (
            <span className="doctor-card__meta-item">
              <ShieldIcon />
              <span className="doctor-card__meta-text">{t("guard_doctor")}</span>
            </span>
          )}
          <span className="doctor-card__meta-item">
            <ClockIcon />
            <span className="doctor-card__meta-text">
              {meta.responseTime ? `${meta.responseTime} ${t("mins")}` : "-"}
            </span>
          </span>
        </div>
        <footer className="doctor-card__footer">
          <div className="doctor-card__price">
            <span className="doctor-card__price-item">
              <CommentIcon />
              <span className="doctor-card__price-text">{price.text} L</span>
            </span>
            <span className="doctor-card__price-item">
              <VideoIcon />
              <span className="doctor-card__price-text">{price.video} L</span>
            </span>
          </div>
          <button className="doctor-card__button" size="sm" type="text">
            <span>{t("wizard:more")}</span>
            <ArrowRightIcon />
          </button>
        </footer>
      </div>
    </article>
  );
};

DoctorCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.shape({
    text: PropTypes.number,
    video: PropTypes.number,
  }),
  category: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.shape({
    responseTime: PropTypes.number,
  }),
  isGuard: PropTypes.bool,
};
