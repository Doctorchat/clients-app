import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDebounce } from "usehooks-ts";

import Input from "@/components/Inputs";
import Spinner from "@/components/Spinner";
import useCurrency from "@/hooks/useCurrency";
import api from "@/services/axios/api";
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

  const debouncedInternalValue = useDebounce(internalValue, 500);

  const onApplyPromocode = React.useCallback(
    async (code) => {
      try {
        setLoading(true);
        setInternalError(null);

        const response = await api.conversation.promo(code);

        setPromocode(code);
        setDiscount((totalPrice * response.data) / 100);
      } catch (error) {
        setInternalError(getApiErrorMessages(error, true));
        setInternalValue("");
      } finally {
        setLoading(false);
      }
    },
    [setDiscount, setPromocode, totalPrice]
  );

  React.useEffect(() => {
    if (debouncedInternalValue && debouncedInternalValue.length > 3) {
      onApplyPromocode(debouncedInternalValue);
    }
  }, [debouncedInternalValue, onApplyPromocode]);

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
        />
        {loading && <Spinner />}
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
