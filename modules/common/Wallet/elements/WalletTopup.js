import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useCurrency from "@/hooks/useCurrency";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { toggleTopUpModal } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const MINIMUM_AMOUNT = {
  MDL: 20,
  EUR: 1,
};

const WalletTopup = ({ popupClassName }) => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  const { isTopUpVisible } = useSelector((store) => ({
    isTopUpVisible: store.user.isTopUpVisible,
  }));

  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        amount: yup.number().min(MINIMUM_AMOUNT[globalCurrency]).required(),
      })
    ),
  });

  const dispatch = useDispatch();

  const topUp = useMutation(["top-up"], (values) => api.wallet.topup(values));

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        const response = await topUp.mutateAsync(values);
        window.location.href = response.data.redirect;
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      }
    },
    [dispatch, topUp]
  );

  const cancelTopUp = () => dispatch(toggleTopUpModal(false));

  return (
    <Portal portalName="modalRoot">
      <Popup
        id="deposit-popup"
        visible={isTopUpVisible}
        onVisibleChange={(v) => dispatch(toggleTopUpModal(v))}
        className={popupClassName}
      >
        <Popup.Header title={t("transactions.top_up_form")} />
        <p className="px-3">
          {t("top-up.minimum_amount", { amount: MINIMUM_AMOUNT[globalCurrency], currency: globalCurrency })}
        </p>
        <div className="p-2">
          <Form methods={form} onFinish={onSubmitHandler}>
            <Form.Item label={t("sum") + `(${globalCurrency})`} name="amount">
              <InputNumber />
            </Form.Item>
            <div className="justify-content-end d-flex align-items-center space-x-2">
              <Button className="me-2" type="outline" size="sm" onClick={cancelTopUp} disabled={topUp.isLoading}>
                {t("back")}
              </Button>

              <Button size="sm" htmlType="submit" loading={topUp.isLoading}>
                {t("supply")}
              </Button>
            </div>
          </Form>
        </div>
      </Popup>
    </Portal>
  );
};

WalletTopup.propTypes = {
  popupClassName: PropTypes.string,
};

WalletTopup.defaultProps = {
  popupClassName: "",
};
export default WalletTopup;
