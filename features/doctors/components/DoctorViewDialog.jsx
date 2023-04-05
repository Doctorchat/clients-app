import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";

import Button, { IconBtn } from "@/components/Button";
import Popup from "@/components/Popup";
import Skeleton from "@/components/Skeleton";
import useCurrency from "@/hooks/useCurrency";
import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";
import HospitalIcon from "@/icons/hospital.svg";
import ShieldIcon from "@/icons/shield.svg";
import TimesIcon from "@/icons/times.svg";
import VideoIcon from "@/icons/video.svg";
import getActiveLng from "@/utils/getActiveLng";
import getPropByLangOrThrow from "@/utils/getPropByLangOrThrow";

const DoctorViewDialogSkeleton = () => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  return (
    <article className="doctor-view skeleton">
      <div className="doctor-view__avatar">
        <Skeleton className="doctor-view__avatar-placeholder" />
      </div>
      <div className="doctor-view__caption">
        <header className="doctor-view__header">
          <p className="doctor-view__experience">
            {t("wizard:work_experience")}: - {t("wizard:years")}
          </p>
          <h3 className="doctor-view__name">-</h3>
        </header>

        <div className="doctor-view__meta">
          <span className="doctor-view__meta-item filled">
            <ShieldIcon />
            <span className="doctor-view__meta-text">{t("guard_doctor")}</span>
          </span>
          <span className="doctor-view__meta-item filled">
            <ClockIcon />
            <span className="doctor-view__meta-text">- {t("mins")}</span>
          </span>
          <span className="doctor-view__meta-item">
            <CommentIcon />
            <span className="doctor-view__meta-text">- {globalCurrency}</span>
          </span>
          <span className="doctor-view__meta-item">
            <VideoIcon />
            <span className="doctor-view__meta-text">- {globalCurrency}</span>
          </span>
        </div>

        <p className="doctor-view__description">
          <Skeleton.Line />
          <Skeleton.Line />
          <Skeleton.Line />
          <Skeleton.Line />
        </p>

        <div className="doctor-view__activity">
          <div className="doctor-view__activity-item">
            <h4 className="doctor-view__activity-title">{t("work")}:</h4>
            <p className="doctor-view__activity-description">
              <HospitalIcon />
              <span>-</span>
            </p>
          </div>
          <div className="doctor-view__activity-item">
            <h4 className="doctor-view__activity-title">{t("education")}:</h4>
            <p className="doctor-view__activity-description">
              <GraduationIcon />-
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export const DoctorViewDialog = ({ doctor, isLoading, onClose, onMessageTypeClick, onVideoTypeClick }) => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();
  const { value: isOpen, setFalse: onHideModal } = useBoolean(true);

  const [isMessageTypeLoading, setIsMessageTypeLoading] = React.useState(false);
  const [isVideoTypeLoading, setIsVideoTypeLoading] = React.useState(false);

  const onVisibleChange = React.useCallback(() => {
    onClose();
    onHideModal();
  }, [onHideModal, onClose]);

  const onMessageTypeClickHandler = React.useCallback(async () => {
    setIsMessageTypeLoading(true);
    await onMessageTypeClick();
    setIsMessageTypeLoading(false);
  }, [onMessageTypeClick]);

  const onVideoTypeClickHandler = React.useCallback(async () => {
    setIsVideoTypeLoading(true);
    await onVideoTypeClick();
    setIsVideoTypeLoading(false);
  }, [onVideoTypeClick]);

  return (
    <Popup className="doctor-view__modal" visible={isOpen} onVisibleChange={onVisibleChange}>
      {isLoading ? (
        <DoctorViewDialogSkeleton />
      ) : (
        <article className="doctor-view">
          <IconBtn className="doctor-view__modal-close" icon={<TimesIcon />} onClick={onVisibleChange} />

          <div className="doctor-view__avatar">
            <img src={doctor.avatar} alt={doctor.name} />
          </div>
          <div className="doctor-view__caption">
            <header className="doctor-view__header">
              <p className="doctor-view__experience">
                {t("wizard:work_experience")}: {doctor.about.experience} {t("wizard:years")}
              </p>
              <h3 className="doctor-view__name">{doctor.name}</h3>
            </header>

            <div className="doctor-view__meta">
              {doctor.isGuard && (
                <span className="doctor-view__meta-item filled">
                  <ShieldIcon />
                  <span className="doctor-view__meta-text">{t("guard_doctor")}</span>
                </span>
              )}
              <span className="doctor-view__meta-item filled">
                <ClockIcon />
                <span className="doctor-view__meta-text">
                  {doctor.activity.responseTime ? `${doctor.activity.responseTime} ${t("mins")}` : "-"}
                </span>
              </span>
              <span className="doctor-view__meta-item">
                <CommentIcon />
                <span className="doctor-view__meta-text">
                  {doctor.price} {globalCurrency}
                </span>
              </span>
              <span className="doctor-view__meta-item">
                <VideoIcon />
                <span className="doctor-view__meta-text">
                  {doctor.meet_price} {globalCurrency}
                </span>
              </span>
            </div>

            <p className="doctor-view__description">{getPropByLangOrThrow(doctor.about?.bio, getActiveLng())}</p>

            <div className="doctor-view__activity">
              <div className="doctor-view__activity-item">
                <h4 className="doctor-view__activity-title">{t("work")}:</h4>
                <p className="doctor-view__activity-description">
                  <HospitalIcon />
                  <span>{doctor.activity.workplace}</span>
                </p>
              </div>
              <div className="doctor-view__activity-item">
                <h4 className="doctor-view__activity-title">{t("education")}:</h4>
                <p className="doctor-view__activity-description">
                  <GraduationIcon />
                  {doctor.activity.education[0]}
                </p>
              </div>
            </div>

            <footer className="doctor-view__footer">
              {doctor.chat && (
                <Button
                  className="doctor-view__button"
                  loading={isMessageTypeLoading}
                  onClick={onMessageTypeClickHandler}
                >
                  <span>{t("wizard:chat_consultation")}</span>
                </Button>
              )}
              {doctor.video && (
                <Button
                  className="doctor-view__button"
                  type="outline"
                  loading={isVideoTypeLoading}
                  onClick={onVideoTypeClickHandler}
                >
                  <span>{t("video_appointment")}</span>
                </Button>
              )}
            </footer>
          </div>
        </article>
      )}
    </Popup>
  );
};

DoctorViewDialog.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number,
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
    chat: PropTypes.bool,
    video: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onMessageTypeClick: PropTypes.func,
  onVideoTypeClick: PropTypes.func,
};
