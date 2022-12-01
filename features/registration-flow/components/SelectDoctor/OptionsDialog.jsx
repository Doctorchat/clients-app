import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useBoolean, useEffectOnce } from "usehooks-ts";

import Button, { IconBtn } from "@/components/Button";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import CheckIcon from "@/icons/check.svg";
import DoctorIcon from "@/icons/doctor.svg";
import DoctorQuestionMarkIcon from "@/icons/doctor-question-mark.svg";
import TimesIcon from "@/icons/times.svg";
import cs from "@/utils/classNames";

export const OptionsDialog = ({ onAutoTypeClick }) => {
  const { t } = useTranslation();

  const { value: isOpen, setFalse: onHideModal, setTrue: onOpenModal } = useBoolean(false);

  useEffectOnce(() => setTimeout(onOpenModal));

  const [isAutoTypeLoading, setIsAutoTypeLoading] = React.useState(false);

  const onAutoTypeClickHandler = React.useCallback(async () => {
    setIsAutoTypeLoading(true);
    await onAutoTypeClick();
    setIsAutoTypeLoading(false);
  }, [onAutoTypeClick]);

  return (
    <Popup className="registration-flow__modal select-doctor__options-modal" visible={isOpen}>
      <div className="options-modal__content">
        <IconBtn className="options-modal__close" icon={<TimesIcon />} onClick={onHideModal} />

        <header>
          <h3>Alege doctorul potrivit</h3>
        </header>

        <div className="select-doctor__options">
          <div
            className={cs("select-doctor__option", !isAutoTypeLoading && "active")}
            role="button"
            onClick={onHideModal}
          >
            {!isAutoTypeLoading && (
              <div className="option__checkmark">
                <CheckIcon />
              </div>
            )}
            <div className="option__icon">
              <DoctorIcon />
            </div>
            <div className="option__caption">
              <h3>{t("wizard:select_doctor.from_list.title")}</h3>
              <p>{t("wizard:select_doctor.from_list.description")}</p>
            </div>
          </div>
          <div
            className="select-doctor__option"
            role="button"
            data-loading={isAutoTypeLoading}
            onClick={onAutoTypeClickHandler}
          >
            {isAutoTypeLoading && (
              <div className="option__checkmark">
                <Spinner />
              </div>
            )}
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

OptionsDialog.propTypes = {
  onAutoTypeClick: PropTypes.func,
};
