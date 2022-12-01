import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import Select from "@/components/Select";
import {
  allergiesOptions,
  diseasesOptions,
  epidemiologicalOptions,
} from "@/context/staticSelectOpts";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import i18next from "@/services/i18next";
import { updateUser } from "@/store/slices/userSlice";
import isValidSelectOption from "@/utils/isValidSelectOption";

const medicalRecordsSchema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().min(0).required(),
  weight: yup.number().min(0).required(),
  height: yup.number().min(0).required(),
  location: yup.string().required(),
  activity: yup.string().required(),
  sex: yup
    .mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  epidemiological: yup
    .mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  diseases: yup
    .mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  diseases_spec: yup.string().required(),
  allergies: yup
    .mixed()
    .required()
    .test({
      name: "select-validation",
      message: i18next.t("yup_mixed_required"),
      test: (value) => isValidSelectOption(value),
    }),
  allergies_spec: yup.string().required(),
});

export const MedicalRecordsForm = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const resolver = useYupValidationResolver(medicalRecordsSchema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values };

      data.sex = data.sex.value;
      data.epidemiological = data.epidemiological.value;
      data.diseases = data.diseases.value;
      data.allergies = data.allergies.value;

      try {
        setIsLoading(true);

        const response = await api.user.addInvestigation(data);
        dispatch(updateUser(response));
        await router.replace("/registration-flow/select-doctor");
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, setFormApiErrors, router]
  );

  return (
    <Form
      className="registration-flow__form"
      methods={form}
      onFinish={onSubmit}
      initialValues={{ phone: "" }}
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
      <div className="form-bottom">
        <Button htmlType="submit" loading={isLoading}>
          {t("continue")}
        </Button>
      </div>
    </Form>
  );
};
