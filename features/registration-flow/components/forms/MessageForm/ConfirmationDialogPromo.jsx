import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import Input from "@/components/Inputs";
import Spinner from "@/components/Spinner";
import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";
import cs from "@/utils/classNames";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const promoInputReplacer = (value) => {
  if (value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  return value;
};

export const ConfirmationDialogPromo = ({ totalPrice, promocode, discount, setPromocode, setDiscount }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [internalError, setInternalError] = React.useState(null);

  const onApplyPromocode = React.useCallback(async () => {
    try {
      setLoading(true);
      setInternalError(null);

      const response = await api.conversation.promo(internalValue);

      setPromocode(internalValue);
      setDiscount((totalPrice * response.data) / 100);
    } catch (error) {
      setInternalError(getApiErrorMessages(error, true));
      setInternalValue("");
    } finally {
      setLoading(false);
    }
  }, [internalValue, setDiscount, setPromocode, totalPrice]);

  if (promocode) {
    return (
      <>
        <span className="d-block">
          {t("message_form_confirmation.code")}: <mark className="dc-mark">{promocode}</mark>
        </span>
        <span className="mt-1 d-block">
          {t("message_form_confirmation.discount")}: <mark className="dc-mark">{formatPrice(discount)}</mark>
        </span>
      </>
    );
  }

  return (
    <div className="promo-code-form">
      <label className="form-control-label is-active" htmlFor="code">
        {t("message_form_confirmation.code")}
      </label>
      <div className="position-relative">
        <Input
          id="code"
          autoComplete="off"
          placeholder="WINTER20"
          value={internalValue}
          onChange={(e) => setInternalValue(promoInputReplacer(e.target.value))}
          onBlur={() => {
            if (internalValue.length > 3) onApplyPromocode();
          }}
        />
        {loading && <Spinner />}
        {loading === false && (
          <Button className={cs("promo-code-form__apply-button", internalValue.length > 3 && "visible")}>
            {t("apply")}
          </Button>
        )}
      </div>
      {internalError && <span className="form-item-error">{internalError}</span>}
    </div>
  );
};

ConfirmationDialogPromo.propTypes = {
  totalPrice: PropTypes.number,
  promocode: PropTypes.string,
  discount: PropTypes.number,
  setPromocode: PropTypes.func,
  setDiscount: PropTypes.func,
};
