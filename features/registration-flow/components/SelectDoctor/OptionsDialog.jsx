import React from "react";
import { useTranslation } from "react-i18next";
import { useBoolean, useEffectOnce } from "usehooks-ts";

import Button, { IconBtn } from "@/components/Button";
import Popup from "@/components/Popup";
import CheckIcon from "@/icons/check.svg";
import DoctorIcon from "@/icons/doctor.svg";
import DoctorQuestionMarkIcon from "@/icons/doctor-question-mark.svg";
import TimesIcon from "@/icons/times.svg";

export const OptionsDialog = () => {
  const { t } = useTranslation();

  const { value: isOpen, setFalse: onHideModal, setTrue: onOpenModal } = useBoolean(false);

  useEffectOnce(() => setTimeout(onOpenModal));

  return (
    <Popup className="registration-flow__modal select-doctor__options-modal" visible={isOpen}>
      <div className="options-modal__content">
        <IconBtn className="options-modal__close" icon={<TimesIcon />} onClick={onHideModal} />

        <header>
          <h3>Alege doctorul potrivit</h3>
        </header>

        <div className="select-doctor__options">
          <div className="select-doctor__option active" role="button" onClick={onHideModal}>
            <div className="option__checkmark">
              <CheckIcon />
            </div>
            <div className="option__icon">
              <DoctorIcon />
            </div>
            <div className="option__caption">
              <h3>{t("wizard:select_doctor.from_list.title")}</h3>
              <p>{t("wizard:select_doctor.from_list.description")}</p>
            </div>
          </div>
          <div className="select-doctor__option" role="button">
            <div className="option__icon">
              <DoctorQuestionMarkIcon />
            </div>
            <div className="option__caption">
              <h3>{t("wizard:select_doctor.automatic.title")}</h3>
              <p>{t("wizard:select_doctor.automatic.description")}</p>
            </div>
          </div>
        </div>

        <Button className="select-doctor__options-action" onClick={onHideModal}>
          {t("continue")}
        </Button>
      </div>
    </Popup>
  );
};
