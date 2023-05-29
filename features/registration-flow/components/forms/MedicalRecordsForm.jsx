import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import * as yup from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { BirthdayInput, InputNumber, Textarea } from "@/components/Inputs";
import Select from "@/components/Select";
import { startConversation } from "@/features/registration-flow";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import api from "@/services/axios/api";
import i18next from "@/services/i18next";
import { updateUser } from "@/store/slices/userSlice";
import date from "@/utils/date";
import isValidSelectOption from "@/utils/isValidSelectOption";

const medicalRecordsSchema = yup.object().shape({
  name: yup.string().required(),
  birth_date: yup
    .date()
    .max(dayjs().subtract(18, "years").toDate(), i18next.t("wizard:age_restrictions", { age: 18 }))
    .required(),
  weight: yup.number().min(1).required(),
  height: yup.number().min(1).required(),
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
  diseases_spec: yup.string().required(),
});

export const MedicalRecordsForm = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.data);

  const dispatch = useDispatch();
  const router = useRouter();

  const resolver = useYupValidationResolver(medicalRecordsSchema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values) => {
      const data = { ...values, birth_date: date(values.birth_date).toServerDate() };

      data.sex = data.sex.value;

      try {
        setIsLoading(true);

        const response = await api.user.addInvestigation(data);
        dispatch(updateUser(response.data));

        const { doctorPreviewId, chatType, messageType } = router.query;
        clearParams(router);
        await startConversation({
          chatType,
          messageType,
          doctorPreviewId,
          investigationId: response.data.investigations[0].id,
        });
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, setFormApiErrors, router]
  );

  return (
    <>
      <Form
        className="registration-flow__form"
        methods={form}
        onFinish={onSubmit}
        initialValues={{ phone: "", name: user?.name ?? "" }}
      >
        <p className="mb-4" style={{ fontSize: 17 }}>
          *{t("investigation_form_description")}
        </p>
        <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
          <Form.Item className="w-100" name="name" label={t("name")}>
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item className="w-100 w-50-sm" label={t("investigation_form.sex")} name="sex">
            <Select
              options={[
                { value: "male", label: t("male") },
                { value: "female", label: t("female") },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item label={t("birthday")} name="birth_date">
          <BirthdayInput
            onError={(error) => {
              if (error) form.setError("birth_date", { message: error });
              else form.clearErrors("birth_date");
            }}
          />
        </Form.Item>

        <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
          <Form.Item className="w-100" label={t("height_cm")} name="height">
            <InputNumber />
          </Form.Item>
          <Form.Item className="w-100" label={t("weight_kg")} name="weight">
            <InputNumber />
          </Form.Item>
        </div>
        <Form.Item label={t("investigation_form.location")} name="location">
          <Input autoComplete="street-address" />
        </Form.Item>
        <Form.Item label={t("investigation_form.activity")} name="activity">
          <Textarea />
        </Form.Item>
        <Form.Item label={t("investigation_form.diseases_spec")} name="diseases_spec">
          <Textarea />
        </Form.Item>
        <div className="form-bottom">
          <Button htmlType="submit" loading={isLoading}>
            {t("continue")}
          </Button>
        </div>
      </Form>
    </>
  );
};

const clearParams = (router) => {
  const query = router.query;
  if (router.isReady) {
    router.push(
      {
        query: {
          slug: query.slug,
        },
      },
      undefined,
      { shallow: true }
    );
  }
};
