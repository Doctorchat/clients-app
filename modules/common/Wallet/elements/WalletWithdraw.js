import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import * as yup from "yup";

import Button from "@/components/Button";
import Confirm from "@/components/Confirm";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { notification } from "@/store/slices/notificationsSlice";

const WalletWithdraw = (props) => {
  const { t } = useTranslation();

  const { balance } = props;

  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        amount: yup.number().min(100).max(Number(balance)).required(),
      })
    ),
  });
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        setIsWithdrawModalOpen(false);
        queryClient.invalidateQueries(["wallet"]);
        queryClient.invalidateQueries(["wallet-transactions"]);
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      }
    },
    [dispatch, queryClient]
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <Button className="w-100" size="sm" onClick={() => setIsWithdrawModalOpen(true)}>
          {t("transactions.withdraw")}
        </Button>
      </div>
      <Portal portalName="modalRoot">
        <Popup
          id="withdraw-popup"
          visible={isWithdrawModalOpen}
          onVisibleChange={setIsWithdrawModalOpen}
        >
          <Popup.Header title={t("transactions.withdraw_form")} />
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
                  onClick={() => setIsWithdrawModalOpen(false)}
                >
                  {t("cancel")}
                </Button>

                <Confirm
                  content={t("transactions.withdraw_confirmation")}
                  onConfirm={form.handleSubmit(onSubmitHandler)}
                  isAsync
                >
                  <Button size="sm">{t("apply")}</Button>
                </Confirm>
              </div>
            </Form>
          </Popup.Content>
        </Popup>
      </Portal>
    </>
  );
};

WalletWithdraw.propTypes = {
  balance: PropTypes.number,
};

export default WalletWithdraw;
