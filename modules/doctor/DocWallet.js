import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import Button from "@/components/Button";
import Confirm from "@/components/Confirm";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { addTransaction } from "@/store/slices/transactionsListSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

export default function DocWallet() {
  const { user } = useSelector((store) => ({
    user: store.user.data,
    transactionsList: store.transactionsList,
  }));
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const form = useForm({
    resolver: useYupValidationResolver(
      yup.object().shape({
        amount: yup.number().min(100).max(Number(user.private?.balance)).required(),
      })
    ),
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        const response = await api.wallet.withdrawn(values);
        dispatch(
          updateUserProperty({
            prop: "private",
            value: { ...user.private, balance: (user.private?.balance || 0) - values.amount },
          })
        );
        dispatch(addTransaction(response.data));
        setIsWithdrawOpen(false);
        return Promise.resolve();
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
        return Promise.reject();
      }
    },
    [dispatch, user]
  );

  return (
    <>
      <div className="doc-wallet">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h3 className="total me-3">{user.private?.balance || "0.00"} Lei</h3>
          <Button
            size="sm"
            onClick={() => setIsWithdrawOpen(true)}
            disabled={!user.private?.balance || Number(user.private?.balance) < 100}
          >
            {t("withdraw")}
          </Button>
        </div>
        <div className="d-flex justify-content-between gap-3">
          <div className="position-relative">
            <p className="m-0" style={{ fontSize: 14, paddingLeft: 4 }}>
              {t("price_message")}
            </p>
            <InputNumber readOnly format="decimal" value={user.private?.chat} addonBefore="MDL" />
          </div>
          <div className="position-relative">
            <p className="m-0" style={{ fontSize: 14, paddingLeft: 4 }}>
              {t("price_meet")}
            </p>
            <InputNumber
              readOnly
              format="decimal"
              value={user.private?.meet || 0}
              addonBefore="MDL"
            />
          </div>
        </div>
      </div>
      <Portal portalName="modalRoot">
        <Popup id="withdraw-popup" visible={isWithdrawOpen} onVisibleChange={setIsWithdrawOpen}>
          <Popup.Header title={t("withdrawal_form")} />
          <Popup.Content>
            <Form
              methods={form}
              onFinish={onSubmitHandler}
              initialValues={{
                amount: user.private?.balance || "",
              }}
            >
              <Form.Item label={t("sum")} name="amount">
                <InputNumber />
              </Form.Item>
              <div className="d-flex justify-content-end align-items-center">
                <Button
                  type="outline"
                  size="sm"
                  className="me-2"
                  onClick={() => setIsWithdrawOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Confirm
                  content={t("withdraw_confirmation")}
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
}
