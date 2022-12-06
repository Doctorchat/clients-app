import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input, { Textarea } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import Tabs, { Line } from "@/packages/Tabs";
import api from "@/services/axios/api";
import { editProfileSchema } from "@/services/validation";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const tabsKeys = {
  ro: "edit-ro",
  ru: "edit-ru",
  en: "edit-en",
};

export default function DocMultiLangEdit() {
  const { user } = useSelector((store) => ({
    user: store.user.data,
  }));
  const [tabsConfig, setTabsConfig] = useState({ key: tabsKeys.ro, dir: "next" });
  const resolver = useYupValidationResolver(editProfileSchema.docMultilangEdit);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver,
    defaultValues: {
      specialization_ro: user.about?.specialization_ro,
      specialization_ru: user.about?.specialization_ru,
      specialization_en: user.about?.specialization_en,
      bio_ro: user.about?.bio_ro,
      bio_ru: user.about?.bio_ru,
      bio_en: user.about?.bio_en,
    },
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const updateTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setTabsConfig({ key, dir });
      },
    []
  );

  const onUpdateData = useCallback(
    async (values) => {
      try {
        setLoading(true);

        const response = await api.user.updateDoctor(values);

        dispatch(updateUser(response.data));
        dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return (
    <div className="edit-profile-section">
      <h4 className="edit-profile-title">{t("about")}</h4>
      <Line
        className="edit-profile-line"
        activeKey={tabsConfig.key}
        updateTabsConfig={updateTabsConfig}
      >
        <Line.Item title="RO" dataKey={tabsKeys.ro} />
        <Line.Item title="РУ" dataKey={tabsKeys.ru} />
        <Line.Item title="EN" dataKey={tabsKeys.en} />
      </Line>
      <Form methods={form} onFinish={onUpdateData}>
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
              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary" loading={loading}>
                  {t("edit")}
                </Button>
              </div>
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
              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary" loading={loading}>
                  {t("edit")}
                </Button>
              </div>
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
              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary" loading={loading}>
                  {t("edit")}
                </Button>
              </div>
            </>
          </Tabs.Pane>
        </Tabs>
      </Form>
    </div>
  );
}
