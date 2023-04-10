import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import Popup from "@/components/Popup";
import Select from "@/components/Select";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import { investigationFormSchema } from "@/services/validation";
import { investigationFormToggleVisibility } from "@/store/slices/investigationFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";
import DatePickerStyled from "@/packages/DatePickerStyled";
import { disabledDateInFuture } from "@/packages/DatePickerStyled/utils";
import date from "@/utils/date";

export default function ClientInvestigationForm() {
  const {
    investigationForm: { isOpen, isEditing, values },
  } = useSelector((store) => ({
    investigationForm: store.investigationForm,
  }));
  const [loading, setLoading] = useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const resolver = useYupValidationResolver(investigationFormSchema);
  const form = useForm({ resolver });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  useEffect(() => {
    if (!isOpen) setFormEdited(false);
  }, [isOpen]);

  const visibilityHandler = (v) => {
    if (!v) form.reset();
    dispatch(investigationFormToggleVisibility(v));
  };

  const onFormsValuesChanges = useCallback(() => {
    setFormEdited(true);
  }, []);

  const onAddNewInvestigation = async (data, { onSuccess, onError }) => {
    try {
      setLoading(true);

      const response = await api.user.addInvestigation(data);
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateInvestigation = async (data, { onSuccess, onError }) => {
    try {
      setLoading(true);

      const response = await api.user.updateInvestigation(data);
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = useCallback(
    async (formValues) => {
      const data = {
        ...values,
        ...formValues,
        birth_date: date(data.birth_date).toServerDate(),
        sex: typeof data.sex === "object" ? data.sex.value : data.sex,
      };

      const onSuccess = (response) => {
        dispatch(investigationFormToggleVisibility(false));
        dispatch(updateUser(response));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
        setFormEdited(false);
      };

      const onError = (error) => {
        setFormApiErrors(error);
      };

      if (isEditing) {
        onUpdateInvestigation(data, { onSuccess, onError });
      } else {
        onAddNewInvestigation(data, { onSuccess, onError });
      }
    },
    [dispatch, setFormApiErrors, isEditing, values]
  );

  return (
    <Popup
      id="investigation-form"
      visible={isOpen}
      onVisibleChange={visibilityHandler}
      confirmationClose={{
        content: t("investigation_form.confirmation"),
        disabled: !formEdited,
      }}
    >
      <Popup.Header title={t("add_investigation")} />
      <Popup.Content>
        <p className="mb-3" style={{ padding: "0px 8px", fontSize: 17 }}>
          *{t("investigation_form_description")}
        </p>
        <Form
          methods={form}
          name="add-investigation"
          onFinish={onSubmitHandler}
          onValuesChange={onFormsValuesChanges}
          initialValues={values}
        >
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" name="name" label={t("name")}>
              <Input />
            </Form.Item>
            <Form.Item className="w-50" label={t("investigation_form.sex")} name="sex">
              <Select
                options={[
                  { value: "male", label: t("male") },
                  { value: "female", label: t("female") },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" label={t("age")} name="birth_date">
              <DatePickerStyled disabledDate={disabledDateInFuture} style={{ height: 47 }} />
            </Form.Item>
            <Form.Item className="w-100" label={t("height_cm")} name="height">
              <InputNumber />
            </Form.Item>
            <Form.Item className="w-100" label={t("weight_kg")} name="weight">
              <InputNumber />
            </Form.Item>
          </div>
          <Form.Item label={t("investigation_form.location")} name="location">
            <Input />
          </Form.Item>
          <Form.Item label={t("investigation_form.activity")} name="activity">
            <Textarea />
          </Form.Item>
          <Form.Item label={t("investigation_form.diseases_spec")} name="diseases_spec">
            <Textarea />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" loading={loading}>
              {t("apply")}
            </Button>
          </div>
        </Form>
      </Popup.Content>
    </Popup>
  );
}
