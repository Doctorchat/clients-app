import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Popup from "@/components/Popup";
import { investigationFormToggleVisibility } from "@/store/slices/investigationFormSlice";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { investigationFormSchema } from "@/services/validation";
import Select from "@/components/Select";
import {
  allergiesOptions,
  diseasesOptions,
  epidemiologicalOptions,
} from "@/context/staticSelectOpts";
import Button from "@/components/Button";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";

export default function ClientInvestigationForm() {
  const {
    investigationForm: { isOpen, isEditing, values },
  } = useSelector((store) => ({
    investigationForm: store.investigationForm,
  }));
  const [loading, setLoading] = useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const resolver = useYupValidationResolver(investigationFormSchema);
  const form = useForm({ resolver, values });
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
    async (values) => {
      const data = { ...values };

      data.sex = data.sex.value;
      data.epidemiological = data.epidemiological.value;
      data.diseases = data.diseases.value;
      data.allergies = data.allergies.value;

      const onSuccess = (response) => {
        dispatch(investigationFormToggleVisibility(false));
        dispatch(updateUser(response));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
        setFormEdited(false);
      };

      const onError = () => {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      };

      if (isEditing) {
        onUpdateInvestigation(data, { onSuccess, onError });
      } else {
        onAddNewInvestigation(data, { onSuccess, onError });
      }
    },
    [dispatch, isEditing]
  );

  return (
    <Popup
      id="investigation-form"
      visible={isOpen}
      onVisibleChange={visibilityHandler}
      confirmationClose={{
        content: t('investigation_form.confirmation'),
        disabled: !formEdited,
      }}
    >
      <Popup.Header title={t("add_investigation")} />
      <Popup.Content>
        <Form
          methods={form}
          name="add-investigation"
          onFinish={onSubmitHandler}
          onValuesChange={onFormsValuesChanges}
          initialValues={values}
        >
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" name="name" label={t("name")}>
              <Input placeholder="John" />
            </Form.Item>
            <Form.Item className="w-50" label={t("investigation_form.sex")} name="sex">
              <Select
                options={[
                  { value: "male", label: "Masculin" },
                  { value: "female", label: "Feminin" },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" label={t("age")} name="age">
              <InputNumber />
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
          <Form.Item label={t("investigation_form.epidemiological")} name="epidemiological">
            <Select options={epidemiologicalOptions} />
          </Form.Item>
          <Form.Item label={t("investigation_form.diseases")} name="diseases">
            <Select options={diseasesOptions} />
          </Form.Item>
          <Form.Item label={t("investigation_form.diseases_spec")} name="diseases_spec">
            <Textarea />
          </Form.Item>
          <Form.Item label={t("investigation_form.allergies")} name="allergies">
            <Select options={allergiesOptions} />
          </Form.Item>
          <Form.Item label={t("investigation_form.allergies_spec")} name="allergies_spec">
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
