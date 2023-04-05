import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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

const WalletTopup = () => {
  const { t } = useTranslation();
  const { globalCurrency } = useCurrency();

  const { isTopUpVisible } = useSelector((store) => ({
    isTopUpVisible: store.user.isTopUpVisible,
  }));

  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        amount: yup.number().min(1).required(),
      })
    ),
  });

  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        const response = await api.wallet.topup(values);
        window.location.href = response.data.redirect;
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      }
    },
    [dispatch]
  );

  return (
    <Portal portalName="modalRoot">
      <Popup id="deposit-popup" visible={isTopUpVisible} onVisibleChange={(v) => dispatch(toggleTopUpModal(v))}>
        <Popup.Header title={t("transactions.top_up_form")} />
        <Popup.Content>
          <Form methods={form} onFinish={onSubmitHandler}>
            <Form.Item label={t("sum") + `(${globalCurrency})`} name="amount">
              <InputNumber />
            </Form.Item>
            <div className="justify-content-end d-flex align-items-center space-x-2">
              <Button className="me-2" type="outline" size="sm" onClick={() => dispatch(toggleTopUpModal(false))}>
                {t("cancel")}
              </Button>

              <Button size="sm" htmlType="submit">
                {t("supply")}
              </Button>
            </div>
          </Form>
        </Popup.Content>
      </Popup>
    </Portal>
  );
};

export default WalletTopup;
