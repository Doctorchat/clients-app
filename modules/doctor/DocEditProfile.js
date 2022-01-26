import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { EditProfileSecurity } from "../common";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { editProfileSchema } from "@/services/validation";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import Button, { IconBtn } from "@/components/Button";
import Select from "@/components/Select";
import { categoriesOptionsSelector } from "@/store/selectors";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";
import toSelectOpts from "@/utils/toSelectOpts";
import TrashIcon from "@/icons/trash.svg";
import PlusIcon from "@/icons/plus.svg";
import getActiveLng from "@/utils/getActiveLng";
import Tabs, { Line } from "@/packages/Tabs";

const tabsKeys = {
  ro: "edit-ro",
  ru: "edit-ru",
  en: "edit-en",
};

const selectedLng = getActiveLng();

export default function DocEditProfile() {
  const { user, categories } = useSelector((store) => ({
    user: store.user.data,
    categories: categoriesOptionsSelector(store),
  }));
  const { t } = useTranslation();
  const resolver = useYupValidationResolver(editProfileSchema.docGeneral);
  const form = useForm({
    defaultValues: {
      name: user.name,
      category: toSelectOpts("id", `name_${selectedLng}`)(user.category),
      professionalTitle: user.about.professionalTitle,
      price: user.price,
      experience: user.about.experience,
      meet_price: user.meet_price,
      workplace: user.activity.workplace,
      education: user.activity.education.map((edc) => ({ value: edc })),
      specialization_ro: user.about?.specialization_ro || "",
      specialization_ru: user.about?.specialization_ru || "",
      specialization_en: user.about?.specialization_en || "",
      bio_ro: user.about?.bio_ro || "",
      bio_ru: user.about?.bio_ru || "",
      bio_en: user.about?.bio_en || "",
    },
    resolver,
  });
  const [tabsConfig, setTabsConfig] = useState({ key: tabsKeys[selectedLng], dir: "next" });
  const [loading, setLoading] = useState();
  const [isFormEdited, setIsFromEdited] = useState(false);
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const onFormsValuesChanges = useCallback(() => setIsFromEdited(true), []);

  const onUpdateData = useCallback(
    async (values) => {
      const data = { ...values };

      data.category = data.category.map((cat) => cat.value);
      data.education = data.education.map((edc) => edc.value);

      try {
        setLoading(true);

        const response = await api.user.update(data);

        dispatch(updateUser(response.data));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return (
    <div className="edit-profile-content">
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">{t("general_information")}</h4>
        <Form
          methods={form}
          className="edit-profile-form"
          onValuesChange={onFormsValuesChanges}
          onFinish={onUpdateData}
        >
          <Form.Item name="name" label={t("name")}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label={t("speciality")}>
            <Select multiple options={categories} />
          </Form.Item>
          <Form.Item name="professionalTitle" label={t("professional_title")}>
            <Input />
          </Form.Item>
          <Form.Item name="experience" label={t("experience")}>
            <InputNumber addonBefore="ANI" />
          </Form.Item>
          <Form.Item name="workplace" label={t("work")}>
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
                    label={t("education")}
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
          <h4 className="edit-profile-title inside">{t("about")}</h4>
          <Line
            className="edit-profile-line"
            activeKey={tabsConfig.key}
            updateTabsConfig={updateTabsConfig}
          >
            <Line.Item title="Ro" dataKey={tabsKeys.ro} />
            <Line.Item title="Ру" dataKey={tabsKeys.ru} />
            <Line.Item title="En" dataKey={tabsKeys.en} />
          </Line>
          <Tabs
            config={{ ...tabsConfig }}
            updateTabsConfig={updateTabsConfig}
            dataAnimation="y-animation"
            className="overflow-hidden"
          >
            <Tabs.Pane dataKey={tabsKeys.ro} className="px-1 pt-3" unmountOnExit>
              <>
                <Form.Item name="specialization_ro" label={t("specialization", { lng: "ro" })}>
                  <Input />
                </Form.Item>
                <Form.Item name="bio_ro" label={t("about", { lng: "ro" })}>
                  <Textarea />
                </Form.Item>
              </>
            </Tabs.Pane>
            <Tabs.Pane dataKey={tabsKeys.ru} className="px-1 pt-3" unmountOnExit>
              <>
                <Form.Item name="specialization_ru" label={t("specialization", { lng: "ru" })}>
                  <Input />
                </Form.Item>
                <Form.Item name="bio_ru" label={t("about", { lng: "ru" })}>
                  <Textarea />
                </Form.Item>
              </>
            </Tabs.Pane>
            <Tabs.Pane dataKey={tabsKeys.en} className="px-1 pt-3" unmountOnExit>
              <>
                <Form.Item name="specialization_en" label={t("specialization", { lng: "en" })}>
                  <Input />
                </Form.Item>
                <Form.Item name="bio_en" label={t("about", { lng: "en" })}>
                  <Textarea />
                </Form.Item>
              </>
            </Tabs.Pane>
          </Tabs>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary" loading={loading} disabled={!isFormEdited}>
              {t("edit")}
            </Button>
          </div>
        </Form>
      </div>
      <EditProfileSecurity />
    </div>
  );
}
