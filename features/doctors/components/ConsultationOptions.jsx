import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import useCurrency from "@/hooks/useCurrency";
import CheckIcon from "@/icons/check.svg";

const CHAT = "chat";
const VIDEO = "video";
const ONE_MINUTE = 60 * 1000;

const selectDefaultOption = (isChatAvailable, isVideoAvailable) => {
  if (isVideoAvailable) {
    return VIDEO;
  }

  if (isChatAvailable) {
    return CHAT;
  }

  return null;
};

function ConsultationOption({ title, price, available_discount, selected, onClick, disabled }) {
  const { globalCurrency } = useCurrency();
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.data);

  const [isDiscountActive, setIsDiscountActive] = useState(false);

  const timer = React.useRef(null);

  React.useEffect(() => {
    if (available_discount && available_discount.expires_at) {
      const isDiscountActive = () => {
        return new Date(available_discount.expires_at).getTime() - new Date().getTime() > ONE_MINUTE;
      };

      setIsDiscountActive(isDiscountActive());

      timer.current = setInterval(() => {
        const isActive = isDiscountActive();
        setIsDiscountActive(isActive);
        if (!isActive) clearInterval(timer.current);
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [available_discount]);

  return (
    <div className={clsx("card", { selected, disabled })} onClick={onClick}>
      {selected && <CheckIcon className="checked" />}
      <div className="card-title">{title}</div>

      {!user?.company_id && (
        <>
          {isDiscountActive === false && (
            <div className="card-price">
              <span className="label">{t("price")}:</span>
              <span className="price">
                {price} {globalCurrency}
              </span>
            </div>
          )}
          {available_discount && isDiscountActive === true && (
            <div className="card-price__discount">
              <span className="label">{t("price")}:</span>
              <span className="old-price">
                {price} {globalCurrency}
              </span>
              <span className="new-price">
                {price - price * (available_discount.discount / 100)} {globalCurrency}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

ConsultationOption.propTypes = {
  title: PropTypes.string,
  price: PropTypes.number,
  available_discount: PropTypes.object,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

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
          title={t("video_appointment")}
          price={meet_price}
          available_discount={doctor.available_discount}
          selected={isSelected(VIDEO)}
          onClick={handleOptionClick(VIDEO)}
          disabled={isDisabled(VIDEO)}
        />

        <ConsultationOption
          title={t("wizard:chat_consultation")}
          price={price}
          available_discount={doctor.available_discount}
          selected={isSelected(CHAT)}
          onClick={handleOptionClick(CHAT)}
          disabled={isDisabled(CHAT)}
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
