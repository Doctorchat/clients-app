import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";

const WalletTopup = () => {
  const { t } = useTranslation();
  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        amount: yup.number().min(100).required(),
      })
    ),
  });
  const dispatch = useDispatch();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        const response = await api.wallet.topup(values);
        window.location.href = response.data.redirect;
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      }
    },
    [dispatch]
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <Button className="w-100" size="sm" onClick={() => setIsDepositModalOpen(true)}>
          {t("transactions.top_up")}
        </Button>
      </div>
      <Portal portalName="modalRoot">
        <Popup
          id="deposit-popup"
          visible={isDepositModalOpen}
          onVisibleChange={setIsDepositModalOpen}
        >
          <Popup.Header title={t("transactions.top_up_form")} />
          <Popup.Content>
            <Form methods={form} onFinish={onSubmitHandler}>
              <Form.Item label={t("sum")} name="amount">
                <InputNumber />
              </Form.Item>
              <div className="justify-content-end d-flex align-items-center space-x-2">
                <Button
                  className="me-2"
                  type="outline"
                  size="sm"
                  onClick={() => setIsDepositModalOpen(false)}
                >
                  {t("cancel")}
                </Button>

                <Button size="sm" htmlType="submit">
                  {t("apply")}
                </Button>
              </div>
            </Form>
          </Popup.Content>
        </Popup>
      </Portal>
    </>
  );
};

export default WalletTopup;
