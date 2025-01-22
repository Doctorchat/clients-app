import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import useCurrency from "@/hooks/useCurrency";
import CheckIcon from "@/icons/check.svg";

const CHAT = "chat";
const VIDEO = "video";
const PHYSICAL = "physical";
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

function ConsultationOption({ title, price, available_discount, selected, onClick, disabled, info }) {
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

  console.log("[ConsultationOption]: price", price);

  return (
    <div className={clsx("card", { selected, disabled })} onClick={onClick}>
      {selected && <CheckIcon className="checked" />}
      <div className="card-title">{title}</div>

      {price && !user?.company_id && (
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

      {info && <div className="text-left text-sm text-gray-500">{info}</div>}
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
  const { push } = useRouter();
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
    }

    if (selectedOption === VIDEO) {
      await onVideoTypeClick();
    }

    if (selectedOption === PHYSICAL) {
      await push(`/registration-flow/medical-centre?doctor=${doctorId?.id}`, {scroll: true})
    }

    setIsButtonLoading(false);
  };

  const isSelected = (type) => type === selectedOption;
  const isDisabled = (type) => (type === CHAT && !isChatAvailable) || (type === VIDEO && !isVideoAvailable);

  console.log("[ConsultationOptions] doctor", doctor);
  return (
    <>
      <section className="consultation-options space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        <ConsultationOption
          title={t("medical_centre:physical_appointment")}
          info={t("medical_centre:price_varies_by_centre")}
          selected={isSelected(PHYSICAL)}
          onClick={handleOptionClick(PHYSICAL)}
          disabled={isDisabled(PHYSICAL)}
        />

        <Button onClick={handleStartButtonClick} loading={isButtonLoading}>
          {t("selected_consultation")}
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
