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
      category: toSelectOpts("id", "name_ro")(user.card.category),
      specialization: user.card.about.specialization,
      professionalTitle: user.card.about.professionalTitle,
      price: user.card.price,
      experience: user.card.about.experience,
      meet_price: user.card.meet_price,
      workplace: user.card.activity.workplace,
      bio: user.card.about.bio,
      education: user.card.activity.education,
    },
    resolver: generalDataResolver,
  });
  const securityDataForm = useForm({ resolver: securityDataResolver });
  const [formEditConfig, setFormEditConfig] = useState({
    general: { edited: false, loading: false },
    security: { edited: false },
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

      try {
        setFormEditConfig((prev) => ({ ...prev, general: { ...prev.general, loading: true } }));
        const response = await api.user.update(data);
        dispatch(updateUser(response.data));
      } catch (error) {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
      } finally {
        setFormEditConfig((prev) => ({ ...prev, general: { ...prev.general, loading: false } }));
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
          <Form.List name="education">
            {({ fields, add, remove }) =>
              fields.map((field, idx) => (
                <div
                  className="inputs-list-item d-flex"
                  key={`education-${idx}`}
                >
                  <Form.Item label="Educație" className="w-100 me-1" name={`education.${idx}`}>
                    <Input />
                  </Form.Item>
                  {idx !== 0 && (
                    <IconBtn
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
            <Button htmlType="submit" type="primary" disabled={!formEditConfig.general.edited}>
              Editează
            </Button>
          </div>
        </Form>
      </div>
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">Securitate</h4>
        <Form methods={securityDataForm} className="edit-profile-form">
          <Form.Item name="password" label="Parolă Nouă">
            <Input type="password" />
          </Form.Item>
          <Form.Item name="password_confirmation" label="Repetă Parola">
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              Editează
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
