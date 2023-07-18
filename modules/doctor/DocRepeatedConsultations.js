import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Select from "@/components/Select";
import Sidebar from "@/components/Sidebar";
import { leftSideTabs } from "@/context/TabsKeys";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import i18next from "@/services/i18next";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import isValidSelectOption from "@/utils/isValidSelectOption";

const schema = yup.object().shape({
  offer_discount: yup
    .mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value), //
    }),
  discount_days: yup.number().min(1).required(),
  discount: yup.number().min(10).max(50).required(),
});

export default function DocRepeatedConsultations() {
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();

  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      offer_discount: user.offer_discount ? "yes" : "no",
      discount_days: user.discount_days,
      discount: user.discount,
    },
    resolver: useYupValidationResolver(schema),
  });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [loading, setLoading] = useState();

  const onSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.offer_discount = data.offer_discount.value === "yes";

      try {
        setLoading(true);

        await api.user.updateDiscount(data);

        dispatch(updateUserProperty({ prop: "offer_discount", value: data.offer_discount }));
        dispatch(updateUserProperty({ prop: "discount_days", value: data.discount_days }));
        dispatch(updateUserProperty({ prop: "discount", value: data.discount }));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setFormApiErrors]
  );

  return (
    <Sidebar>
      <Sidebar.Header className="border-bottom">
        <BackTitle
          title={t("repeated_consultations.title")}
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <div className="px-4 pt-3">
        <h6>{t("repeated_consultations.description")}</h6>
        <p className="text-muted">{t("repeated_consultations.note")}</p>
        <p className="text-muted">{t("repeated_consultations.warning")}</p>
        <Form methods={form} onFinish={onSubmit}>
          <Form.Item className="w-50" name="offer_discount">
            <Select
              options={[
                { value: "yes", label: t("yes") },
                { value: "no", label: t("no") },
              ]}
            />
          </Form.Item>
          <Form.Item name="discount_days" label={t("repeated_consultations.duration")}>
            <Input />
          </Form.Item>
          <Form.Item name="discount" label={t("repeated_consultations.discount")}>
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary" loading={loading}>
              {t("edit")}
            </Button>
          </div>
        </Form>
      </div>
    </Sidebar>
  );
}
