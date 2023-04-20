import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import CheckIcon from "@/icons/check.svg";
import Button from "@/components/Button";
import useCurrency from "@/hooks/useCurrency";

const CHAT = "chat";
const VIDEO = "video";

const selectDefaultOption = (isChatAvailable, isVideoAvailable) => {
  if (isChatAvailable) {
    return CHAT;
  }

  if (isVideoAvailable) {
    return VIDEO;
  }

  return null;
};

// eslint-disable-next-line react/prop-types
function ConsultationOption({ title, price, selected, onClick, disabled }) {
  const { globalCurrency } = useCurrency();
  const { t } = useTranslation();

  return (
    <div className={clsx("card", { selected, disabled })} onClick={onClick}>
      {selected && <CheckIcon className="checked" />}
      <div className="card-title">{title}</div>
      <div className="card-price">
        <span className="label">{t("price")}:</span>
        <span className="price">
          {price} {globalCurrency}
        </span>
      </div>
    </div>
  );
}

function ConsultationOptions({ doctor, onMessageTypeClick, onVideoTypeClick }) {
  const { price, meet_price, video: isVideoAvailable, chat: isChatAvailable } = doctor;

  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState(selectDefaultOption(isChatAvailable, isVideoAvailable));
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const handleOptionClick = (index) => () => {
    if (isButtonLoading) return;
    setSelectedOption(index);
  };

  const handleStartButtonClick = async () => {
    setIsButtonLoading(true);

    if (selectedOption === CHAT) {
      await onMessageTypeClick();
    } else if (selectedOption === VIDEO) {
      await onVideoTypeClick();
    }

    setIsButtonLoading(false);
  };

  const isSelected = (type) => type === selectedOption;
  const isDisabled = (type) => (type === CHAT && !isChatAvailable) || (type === VIDEO && !isVideoAvailable);

  return (
    <>
      <section className="consultation-options">
        <ConsultationOption
          title={t("wizard:chat_consultation")}
          price={price}
          selected={isSelected(CHAT)}
          onClick={handleOptionClick(CHAT)}
          disabled={isDisabled(CHAT)}
        />

        <ConsultationOption
          title={t("video_appointment")}
          price={meet_price}
          selected={isSelected(VIDEO)}
          onClick={handleOptionClick(VIDEO)}
          disabled={isDisabled(VIDEO)}
        />

        <Button onClick={handleStartButtonClick} loading={isButtonLoading}>
          {t("select")}
        </Button>
      </section>
    </>
  );
}

ConsultationOptions.propTypes = {
  doctor: PropTypes.object.isRequired,
  onMessageTypeClick: PropTypes.func.isRequired,
  onVideoTypeClick: PropTypes.func.isRequired,
};
export default ConsultationOptions;
