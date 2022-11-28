import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";

import Button, { IconBtn } from "@/components/Button";
import Popup from "@/components/Popup";
import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";
import HospitalIcon from "@/icons/hospital.svg";
import ShieldIcon from "@/icons/shield.svg";
import TimesIcon from "@/icons/times.svg";
import VideoIcon from "@/icons/video.svg";
import getActiveLng from "@/utils/getActiveLng";
import getPropByLangOrThrow from "@/utils/getPropByLangOrThrow";

export const DoctorViewDialog = ({ doctor, onMessageTypeClick, onVideoTypeClick }) => {
  const { t } = useTranslation();
  const { value: isOpen, setFalse: onHideModal } = useBoolean(true);

  const { name, avatar, isGuard, price, meet_price, activity, about } = doctor;

  return (
    <Popup className="doctor-view__modal" visible={isOpen}>
      <article className="doctor-view">
        <IconBtn className="doctor-view__modal-close" icon={<TimesIcon />} onClick={onHideModal} />

        <div className="doctor-view__avatar">
          <img src={avatar} alt={name} />
        </div>
        <div className="doctor-view__caption">
          <header className="doctor-view__header">
            <p className="doctor-view__experience">{about.experience} Ani</p>
            <h3 className="doctor-view__name">{name}</h3>
          </header>

          <div className="doctor-view__meta">
            {isGuard && (
              <span className="doctor-view__meta-item filled">
                <ShieldIcon />
                <span className="doctor-view__meta-text">{t("guard_doctor")}</span>
              </span>
            )}
            <span className="doctor-view__meta-item filled">
              <ClockIcon />
              <span className="doctor-view__meta-text">
                {activity.responseTime ? `${activity.responseTime} ${t("mins")}` : "-"}
              </span>
            </span>
            <span className="doctor-view__meta-item">
              <CommentIcon />
              <span className="doctor-view__meta-text">{price} L</span>
            </span>
            <span className="doctor-view__meta-item">
              <VideoIcon />
              <span className="doctor-view__meta-text">{meet_price} L</span>
            </span>
          </div>

          <p className="doctor-view__description">
            {getPropByLangOrThrow(about?.bio, getActiveLng())}
          </p>

          <div className="doctor-view__activity">
            <div className="doctor-view__activity-item">
              <h4 className="doctor-view__activity-title">{t("work")}:</h4>
              <p className="doctor-view__activity-description">
                <HospitalIcon />
                <span>{activity.workplace}</span>
              </p>
            </div>
            <div className="doctor-view__activity-item">
              <h4 className="doctor-view__activity-title">{t("education")}:</h4>
              <p className="doctor-view__activity-description">
                <GraduationIcon />
                {activity.education[0]}
              </p>
            </div>
          </div>

          <footer className="doctor-view__footer">
            <Button className="doctor-view__button" onClick={onMessageTypeClick}>
              <span>{t("describe_problem")}</span>
            </Button>
            <Button className="doctor-view__button" type="outline" onClick={onVideoTypeClick}>
              <span>{t("video_appointment")}</span>
            </Button>
          </footer>
        </div>
      </article>
    </Popup>
  );
};

DoctorViewDialog.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    isGuard: PropTypes.bool,
    price: PropTypes.number,
    meet_price: PropTypes.number,
    activity: PropTypes.shape({
      responseTime: PropTypes.number,
      workplace: PropTypes.string,
      education: PropTypes.arrayOf(PropTypes.string),
    }),
    about: PropTypes.shape({
      bio: PropTypes.shape({
        ro: PropTypes.string,
        ru: PropTypes.string,
        en: PropTypes.string,
      }),
      experience: PropTypes.number,
    }),
  }),
  onMessageTypeClick: PropTypes.func,
  onVideoTypeClick: PropTypes.func,
};
