import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Button, { IconBtn } from "@/components/Button";
import Form from "@/components/Form";
import Input, { InputNumber, InputPhone, Textarea } from "@/components/Inputs";
import Select from "@/components/Select";
import Spinner from "@/components/Spinner";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import PlusIcon from "@/icons/plus.svg";
import TrashIcon from "@/icons/trash.svg";
import { ProfileChangeLang } from "@/modules/common";
import api from "@/services/axios/api";
import { registerDoctorSchema } from "@/services/validation";
import { registerDoctor } from "@/store/actions";
import { toSelectOpts } from "@/store/selectors";
import { notification } from "@/store/slices/notificationsSlice";
import getActiveLng from "@/utils/getActiveLng";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function BecomeDoctor() {
  const resolver = useYupValidationResolver(registerDoctorSchema);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const form = useForm({ resolver, defaultValues: { education: [{ id: 1 }], category: [] } });
  const router = useRouter();
  const dispatch = useDispatch();
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);
  const { t } = useTranslation();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.bootstrap.categories();
      setCategories(toSelectOpts()(response.data));
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    }
  }, [dispatch]);

  useEffect(() => fetchCategories(), [fetchCategories]);

  const onBecomeDoctorSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.category = data.category.map((cat) => cat.value);
      data.education = data.education.map((edc) => edc.value);
      data.locale = getActiveLng();

      try {
        setLoading(true);
        await dispatch(registerDoctor(data));

        if (router.query.redirect) {
          router.push(router.query.redirect);
        } else {
          router.push("/");
        }
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router, setFormApiErrors]
  );

  return (
    <div className="become-doctor-page">
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">
            <Link href="https://doctorchat.md/">
              <a>Doctorchat</a>
            </Link>
          </h3>
        </div>
        <Link href="/auth/login">
          <a>
            <Button type="outline">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form mt-5">
        {!categories.length && <Spinner />}
        <Form name="become-doctor-form" methods={form} onFinish={onBecomeDoctorSubmit} initialValues={{ phone: "" }}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">
            {t("part_of_team")} <br /> Doctorchat
          </h3>
          <div className="d-sm-flex gap-2">
            <Form.Item className="w-100" label={`${t("email")}*`} name="email">
              <Input />
            </Form.Item>
            <Form.Item className="w-100" label={`${t("phone")}*`} name="phone">
              <InputPhone />
            </Form.Item>
          </div>
          <div className="d-sm-flex gap-2">
            <Form.Item className="w-100" name="professionalTitle" label={`${t("professional_title")}*`}>
              <Input />
            </Form.Item>
            <Form.Item className="w-100" name="specialization_ro" label={`${t("specialization")}*`}>
              <Input />
            </Form.Item>
          </div>
          <div className="d-sm-flex gap-2">
            <Form.Item className="w-100" label={`${t("name")}*`} name="name">
              <Input />
            </Form.Item>
            <Form.Item name="experience" label={`${t("experience")}*`}>
              <InputNumber addonBefore="ANI" />
            </Form.Item>
          </div>
          <Form.Item name="category" label={`${t("speciality")}*`}>
            <Select multiple options={categories} />
          </Form.Item>
          <Form.Item name="work" label={`${t("work")}*`}>
            <Input />
          </Form.Item>
          <Form.List name="education" className="inputs-list-vertical">
            {({ fields, add, remove }) =>
              fields.map((field, idx) => (
                <div className="inputs-list-item d-flex align-items-center" key={`education-${field.id}`}>
                  <Form.Item label={`${t("education")}*`} className="w-100 me-1" name={`education.${idx}.value`}>
                    <Input />
                  </Form.Item>
                  {idx === fields.length - 1 && (
                    <IconBtn size="sm" icon={<PlusIcon />} className="add-action" onClick={() => add({ name: "" })} />
                  )}
                  {fields.length !== 1 && (
                    <IconBtn size="sm" icon={<TrashIcon />} className="remove-action" onClick={() => remove(idx)} />
                  )}
                </div>
              ))
            }
          </Form.List>
          <Form.Item name="bio_ro" label={`${t("about")}*`}>
            <Textarea />
          </Form.Item>
          <div className="d-sm-flex gap-2">
            <Form.Item className="w-100" label={`${t("password")}*`} name="password">
              <Input type="password" />
            </Form.Item>
            <Form.Item className="w-100" label={`${t("repeat_password")}*`} name="password_confirmation">
              <Input type="password" />
            </Form.Item>
          </div>
          <div className="form-bottom justify-content-end mt-0">
            <Button htmlType="submit" className="mt-1" loading={loading}>
              {t("send")}
            </Button>
          </div>
        </Form>
      </div>
      <div className="mt-3 auth-layout-lang d-flex justify-content-center">
        <ProfileChangeLang />
      </div>
    </div>
  );
}

BecomeDoctor.getLayout = function (page) {
  return <>{page}</>;
};
