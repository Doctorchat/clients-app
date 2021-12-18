import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { editProfileSchema } from "@/services/validation";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { categoriesOptionsSelector } from "@/store/selectors";

export default function DocEditProfile() {
  const { user, categories } = useSelector((store) => ({
    user: store.user,
    categories: categoriesOptionsSelector(store),
  }));
  const generalDataResolver = useYupValidationResolver(editProfileSchema.docGeneral);
  const securityDataResolver = useYupValidationResolver(editProfileSchema.security);
  const generaDataForm = useForm({
    defaultValues: { name: user.data.name },
    resolver: generalDataResolver,
  });
  const securityDataForm = useForm({ resolver: securityDataResolver });
  const [formEditConfig, setFormEditConfig] = useState({
    general: { edited: false },
    security: { edited: false },
  });

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

  return (
    <div className="edit-profile-content">
      <div className="edit-profile-section">
        <h4 className="edit-profile-title">Informație Generală</h4>
        <Form
          methods={generaDataForm}
          className="edit-profile-form"
          onValuesChange={onFormsValuesChanges("general")}
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
              <InputNumber format="decimal" addonBefore="MDL" />
            </Form.Item>
            <Form.Item name="experience" label="Experientă">
              <InputNumber addonBefore="ANI" />
            </Form.Item>
          </div>
          <Form.Item name="workplace" label="Locul de muncă">
            <Input />
          </Form.Item>
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
