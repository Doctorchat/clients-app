import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
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

export default function DocEditProfile() {
  const { user, categories } = useSelector((store) => ({
    user: store.user.data,
    categories: categoriesOptionsSelector(store),
  }));
  const generalDataResolver = useYupValidationResolver(editProfileSchema.docGeneral);
  const securityDataResolver = useYupValidationResolver(editProfileSchema.security);
  const generaDataForm = useForm({
    defaultValues: {
      name: user.name,
      category: toSelectOpts("id", "name_ro")(user.category),
      specialization: user.about.specialization,
      professionalTitle: user.about.professionalTitle,
      price: user.price,
      experience: user.about.experience,
      meet_price: user.meet_price,
      workplace: user.activity.workplace,
      bio: user.about.bio,
      education: user.activity.education.map((edc) => ({ value: edc })),
    },
    resolver: generalDataResolver,
  });
  const securityDataForm = useForm({ resolver: securityDataResolver });
  const [formEditConfig, setFormEditConfig] = useState({
    general: { edited: false, loading: false },
    security: { edited: false, loading: false },
  });
  const dispatch = useDispatch();

  const onFormsValuesChanges = useCallback(
    (formName) => () => {
      if (!formEditConfig[formName].edited) {
        const formsConfig = { ...formEditConfig };
        formsConfig[formName].edited = true;

        setFormEditConfig(formsConfig);
      }
    },
    [formEditConfig]
  );

  const onUpdateData = useCallback(
    async (values) => {
      const data = { ...values };

      data.category = data.category.map((cat) => cat.value);
      data.education = data.education.map((edc) => edc.value);

      try {
        setFormEditConfig((prev) => ({ ...prev, general: { ...prev.general, loading: true } }));

        const response = await api.user.update(data);

        dispatch(updateUser(response.data));
        dispatch(notification({ title: "Succes", descrp: "Date au fost actualizate cu succes" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
      } finally {
        setFormEditConfig((prev) => ({
          ...prev,
          general: { ...prev.general, loading: false, edited: false },
        }));
      }
    },
    [dispatch]
  );

  const onSecurityUpdate = useCallback(
    async (values) => {
      try {
        setFormEditConfig((prev) => ({
          ...prev,
          security: { ...prev.security, loading: true },
        }));
        await api.user.updatePassword(values);
        dispatch(notification({ title: "Succes", descrp: "Date au fost actualizate cu succes" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
      } finally {
        setFormEditConfig((prev) => ({
          ...prev,
          security: { ...prev.security, loading: false, edited: false },
        }));
      }
    },
    [dispatch]
  );

  return (
    <div className="edit-profile-content">
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">Informație Generală</h4>
        <Form
          methods={generaDataForm}
          className="edit-profile-form"
          onValuesChange={onFormsValuesChanges("general")}
          onFinish={onUpdateData}
        >
          <Form.Item name="name" label="Nume Prenume">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Specialitate">
            <Select multiple options={categories} />
          </Form.Item>
          <Form.Item name="specialization" label="Specializare">
            <Input />
          </Form.Item>
          <Form.Item name="professionalTitle" label="Titlul Profesional">
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-between gap-3">
            <Form.Item name="price" label="Prețul">
              <InputNumber readOnly format="decimal" addonBefore="MDL" />
            </Form.Item>
            <Form.Item name="meet_price" label="Preț conferință">
              <InputNumber addonBefore="MDL" />
            </Form.Item>
          </div>
          <Form.Item name="experience" label="Experientă">
            <InputNumber addonBefore="ANI" />
          </Form.Item>
          <Form.Item name="workplace" label="Locul de muncă">
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
                    label="Educație"
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
                  {fields.length !== 1 && idx !== fields.length - 1 && (
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
          <Form.Item name="bio" label="Despre">
            <Textarea />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button
              htmlType="submit"
              type="primary"
              loading={formEditConfig.general.loading}
              disabled={!formEditConfig.general.edited}
            >
              Editează
            </Button>
          </div>
        </Form>
      </div>
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">Securitate</h4>
        <Form
          methods={securityDataForm}
          className="edit-profile-form"
          onFinish={onSecurityUpdate}
          onValuesChange={onFormsValuesChanges("security")}
        >
          <Form.Item name="current_password" label="Parola Curentă">
            <Input type="password" />
          </Form.Item>
          <Form.Item name="new_password" label="Parola Nouă">
            <Input type="password" />
          </Form.Item>
          <Form.Item name="new_confirm_password" label="Repetă Parola">
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button
              htmlType="submit"
              type="primary"
              disabled={!formEditConfig.security.edited}
              loading={formEditConfig.security.loading}
            >
              Editează
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
