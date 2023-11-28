import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Tabs } from "antd";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";
import { IconBtn } from "@/components/Button";
import DcTooltip from "@/components/DcTooltip";
import Popup from "@/components/Popup";
import ReviewsList from "@/components/ReviewsList";
import Skeleton from "@/components/Skeleton";
import ConsultationOptions from "@/features/doctors/components/ConsultationOptions";
import useCurrency from "@/hooks/useCurrency";
import ClockIcon from "@/icons/clock.svg";
import CommentIcon from "@/icons/comment-lines.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";
import ChatIcon from "@/icons/chat.svg";
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
  const { value: isOpen, setFalse: onHideModal } = useBoolean(true);

  const onVisibleChange = React.useCallback(() => {
    onClose();
    onHideModal();
  }, [onHideModal, onClose]);

  const items = React.useMemo(
    () => [
      {
        key: "1",
        label: t("name_consultation_tab"),
        children: <StepsConsultation />,
      },  {
        key: "2",
        label: t("info_doctor"),
        children: <GeneralInfo doctor={doctor} />,
      },
      {
        key: "3",
        label: t("reviews") + ` (${doctor?.reviews?.length})`,
        children: (
          <div className="limit-height">
            <ReviewsList data={doctor?.reviews} />
          </div>
        ),
        disabled: !doctor?.reviews?.length,
      },
    ],
    [doctor, t]
  );

  return (
    <Popup className="doctor-view__modal" visible={isOpen} onVisibleChange={onVisibleChange}>
      {isLoading || !doctor ? (
        <DoctorViewDialogSkeleton />
      ) : (
        <article className="doctor-view">
          <IconBtn className="doctor-view__modal-close" icon={<TimesIcon />} onClick={onVisibleChange} />

          <div className="doctor-view__avatar">
            <img src={doctor.avatar_full ?? doctor.avatar} alt={doctor.name} />
          </div>
          <div className="doctor-view__caption">
            <header className="doctor-view__header">
              <p className="doctor-view__experience">
                {t("wizard:work_experience")}: {doctor.about.experience} {t("wizard:years")}
              </p>
              <h3 className="doctor-view__name">{doctor.name}</h3>
            </header>

            <Badges doctor={doctor} />
            <Discount doctor={doctor} />

            <ConsultationOptions
              doctor={doctor}
              onVideoTypeClick={onVideoTypeClick}
              onMessageTypeClick={onMessageTypeClick}
            />
            <Tabs defaultActiveKey="1" items={items} type="card" className="change-tabs-colors" />
          </div>
        </article>
      )}
    </Popup>
  );
};

DoctorViewDialog.propTypes = {
  doctor: PropTypes.object,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onMessageTypeClick: PropTypes.func,
  onVideoTypeClick: PropTypes.func,
};

const Badges = ({ doctor }) => {
  const { t } = useTranslation();

  return (
    <div className="doctor-view__meta">
      {!doctor.isGuard && (
        <DcTooltip content={t("guard_doctor_tooltip")}>
          <span className="doctor-view__meta-item filled">
            <ShieldIcon />
            <span className="doctor-view__meta-text">{t("guard_doctor")}</span>
          </span>
        </DcTooltip>
      )}

      <DcTooltip content={t("respond_time_doctor_tooltip")}>
        <span className="doctor-view__meta-item filled">
          <ClockIcon />
          <span className="doctor-view__meta-text">
            {doctor.activity.responseTime ? `${doctor.activity.responseTime} ${t("mins")}` : "-"}
          </span>
        </span>
      </DcTooltip>
    </div>
  );
};

Badges.propTypes = {
  doctor: PropTypes.object,
};

const Discount = ({ doctor }) => {
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = React.useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  const timer = React.useRef(null);

  React.useEffect(() => {
    if (doctor.available_discount && doctor.available_discount.expires_at) {
      const getTimeLeft = () => {
        const expiresAt = new Date(doctor.available_discount.expires_at);
        const now = new Date();

        const days = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((expiresAt - now) / (1000 * 60 * 60)) % 24;
        const minutes = Math.floor((expiresAt - now) / (1000 * 60)) % 60;
        const seconds = Math.floor((expiresAt - now) / 1000) % 60;

        if (minutes > 0) {
          return { d: days, h: hours, m: minutes, s: seconds };
        }

        return false;
      };

      setTimeLeft(getTimeLeft());

      timer.current = setInterval(() => {
        const timeLeft = getTimeLeft();

        if (timeLeft) setTimeLeft(timeLeft);
        else {
          setTimeLeft(false);
          clearInterval(timer.current);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [doctor.available_discount, t]);

  if (!doctor.available_discount) return null;

  return (
    <div className="doctor-view__discount">
      {timeLeft && (
        <>
          <p className="doctor-view__discount-text">
            <Trans
              i18nKey="repeated_consultations_discount.description"
              values={{ discount: doctor.available_discount.discount }}
              components={{ bold: <b /> }}
            />
          </p>
          <div className="countdown">
            <div className="countdown__item">
              <span className="countdown__item-number">{timeLeft.d}</span>
              <span className="countdown__item-text">{t("repeated_consultations_discount.days")}</span>
            </div>
            <div className="countdown__item">
              <span className="countdown__item-number">{timeLeft.h}</span>
              <span className="countdown__item-text">{t("repeated_consultations_discount.hours")}</span>
            </div>
            <div className="countdown__item">
              <span className="countdown__item-number">{timeLeft.m}</span>
              <span className="countdown__item-text">{t("repeated_consultations_discount.minutes")}</span>
            </div>
            <div className="countdown__item">
              <span className="countdown__item-number">{timeLeft.s}</span>
              <span className="countdown__item-text">{t("repeated_consultations_discount.seconds")}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Discount.propTypes = {
  doctor: PropTypes.object,
};
const StepsConsultation = () => {
  const { t } = useTranslation();
 

  return (
    <>
      <p className="doctor-view__description">{t("descriptions_consultation")}</p>

      <div className="doctor-view__activity">
        <div className="doctor-view__activity-item">
          <h4 className="doctor-view__activity-title">{t("info_video")}:</h4>
          <p className="doctor-view__activity-description">
              <VideoIcon />
            <span>{t("card_video_consultation")}</span>
          </p>
        </div>
        <div className="doctor-view__activity-item">
          <h4 className="doctor-view__activity-title">{t("info_chat")}:</h4>
          <p className="doctor-view__activity-description">
            <ChatIcon />
            <span>{t("card_chat_consultation")}</span>
          </p>
        </div>
      </div>
    </>
  );
};

StepsConsultation.propTypes = {};

const GeneralInfo = ({ doctor }) => {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};

GeneralInfo.propTypes = {
  doctor: PropTypes.object,
};
