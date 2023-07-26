import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import ConditionalRender from "@/components/ConditionalRender";
import useCurrency from "@/hooks/useCurrency";
import ArrowRightIcon from "@/icons/arrow-right.svg";
import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import ShieldIcon from "@/icons/shield.svg";
import VideoIcon from "@/icons/video.svg";

export const DoctorCardSkeleton = () => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  return (
    <article className="doctor-card skeleton">
      <div className="doctor-card__avatar">
        <div className="doctor-card__avatar-placeholder" />
      </div>
      <div className="doctor-card__caption">
        <header className="doctor-card__header">
          <h3 className="doctor-card__name">-</h3>
          <h4 className="doctor-card__category">-</h4>
        </header>
        <div className="doctor-card__meta">
          <span className="doctor-card__meta-item">
            <ShieldIcon />
            <span className="doctor-card__meta-text">{t("guard_doctor")}</span>
          </span>
          <span className="doctor-card__meta-item">
            <ClockIcon />
            <span className="doctor-card__meta-text">- {t("mins")}</span>
          </span>
        </div>
        <footer className="doctor-card__footer">
          <div className="doctor-card__price">
            <span className="doctor-card__price-item">
              <CommentIcon />
              <span className="doctor-card__price-text">0.00 {globalCurrency}</span>
            </span>
            <span className="doctor-card__price-item">
              <VideoIcon />
              <span className="doctor-card__price-text">0.00 {globalCurrency}</span>
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export const DoctorCard = ({ doctor, onClickPreview }) => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  const user = useSelector((state) => state.user.data);

  const {
    avatar,
    name,
    experience,
    speciality = [],
    response_time,
    isGuard,
    price_chat,
    price_meet,
    chat,
    video,
  } = doctor;

  return (
    <article className="doctor-card" onClick={onClickPreview}>
      <div className="doctor-card__avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="doctor-card__caption">
        <header className="doctor-card__header">
          <p className="doctor-card__experience">
            {t("wizard:work_experience")}: {experience} {t("wizard:years")}
          </p>
          <h3 className="doctor-card__name">{name}</h3>
          <h4 className="doctor-card__category">{speciality.join(", ")}</h4>
        </header>
        <div className="doctor-card__meta">
          {!!isGuard && (
            <span className="doctor-card__meta-item">
              <ShieldIcon />
              <span className="doctor-card__meta-text">{t("guard_doctor")}</span>
            </span>
          )}
          <span className="doctor-card__meta-item">
            <ClockIcon />
            <span className="doctor-card__meta-text">{response_time ? `${response_time} ${t("mins")}` : "-"}</span>
          </span>
        </div>
        <footer className="doctor-card__footer">
          {!user?.company_id && (
            <div className="doctor-card__price">
              <ConditionalRender hide={!chat}>
                <span className="doctor-card__price-item">
                  <CommentIcon />
                  <span className="doctor-card__price-text">
                    {price_chat} {globalCurrency}
                  </span>
                </span>
              </ConditionalRender>
              <ConditionalRender hide={!video}>
                <span className="doctor-card__price-item">
                  <VideoIcon />
                  <span className="doctor-card__price-text">
                    {price_meet} {globalCurrency}
                  </span>
                </span>
              </ConditionalRender>
            </div>
          )}
          <Button className="doctor-card__button" size="sm" type="text" onClick={onClickPreview}>
            <span>{t("select")}</span>
            <ArrowRightIcon />
          </Button>
        </footer>
      </div>
    </article>
  );
};

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    experience: PropTypes.number,
    speciality: PropTypes.arrayOf(PropTypes.string),
    response_time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isGuard: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    price_chat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_meet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    chat: PropTypes.bool,
    video: PropTypes.bool,
  }),
  onClickPreview: PropTypes.func,
};
