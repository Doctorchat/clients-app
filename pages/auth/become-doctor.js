import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/services/validation";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import Button, { IconBtn } from "@/components/Button";
import { loginUser } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import PlusIcon from "@/icons/plus.svg";
import TrashIcon from "@/icons/trash.svg";
import Select from "@/components/Select";
import { categoriesOptionsSelector } from "@/store/selectors";

export default function BecomeDoctor() {
  const { categories } = useSelector((store) => ({
    categories: categoriesOptionsSelector(store),
  }));
  const resolver = useYupValidationResolver(loginSchema);
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver, defaultValues: { education: [{ id: 1 }] } });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onLoginSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        await dispatch(loginUser(values));

        if (router.query.redirect) {
          router.push(router.query.redirect);
        } else {
          router.push("/");
        }
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: "login_error", duration: 0 })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router]
  );

  return (
    <div className="become-doctor-page">
      <div className="auth-header">
        <div className="auth-header-logo">
          <h3 className="m-0">Doctorchat</h3>
        </div>
        <Link href="/auth/register">
          <a>
            <Button type="outline">{t("login")}</Button>
          </a>
        </Link>
      </div>
      <div className="auth-form mt-4">
        <Form name="become-doctor-form" methods={form} onFinish={onLoginSubmit}>
          <p className="form-subtitle">Doctorchat</p>
          <h3 className="form-title">
            {t("part_of_team")} <br /> Doctorchat
          </h3>
          <div className="d-sm-flex gap-2">
            <Form.Item className="w-100" label={`${t("email")}*`} name="email">
              <Input />
            </Form.Item>
            <Form.Item className="w-100" label={`${t("phone")}*`} name="phone">
              <Input />
            </Form.Item>
          </div>
          <div className="d-sm-flex gap-2">
            <Form.Item
              className="w-100"
              name="professionalTitle"
              label={`${t("professional_title")}*`}
            >
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
          <Form.Item name="workplace" label={`${t("work")}*`}>
            <Input />
          </Form.Item>
          <Form.List name="education" className="inputs-list-vertical">
            {({ fields, add, remove }) =>
              fields.map((field, idx) => (
                <div
                  className="inputs-list-item d-flex align-items-center"
                  key={`education-${field.id}`}
                >
                  <Form.Item
                    label={`${t("education")}*`}
                    className="w-100 me-1"
                    name={`education.${idx}.value`}
                  >
                    <Input />
                  </Form.Item>
                  {idx === fields.length - 1 && (
                    <IconBtn
                      size="sm"
                      icon={<PlusIcon />}
                      className="add-action"
                      onClick={() => add({ name: "" })}
                    />
                  )}
                  {fields.length !== 1 && (
                    <IconBtn
                      size="sm"
                      icon={<TrashIcon />}
                      className="remove-action"
                      onClick={() => remove(idx)}
                    />
                  )}
                </div>
              ))
            }
          </Form.List>
          <Form.Item name="bio_ro" label={`${t("about")}*`}>
            <Textarea />
          </Form.Item>
          <div className="form-bottom justify-content-end">
            <Button htmlType="submit" loading={loading}>
              {t("send")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

BecomeDoctor.getLayout = function (page) {
  return <>{page}</>;
};
