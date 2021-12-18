import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { editProfileSchema } from "@/services/validation";
import Form from "@/components/Form";
import Input, { Textarea } from "@/components/Inputs";
import Button from "@/components/Button";

export default function ClientEditProfile() {
  const { user } = useSelector((store) => ({ user: store.user }));
  const generalDataResolver = useYupValidationResolver(editProfileSchema.clientGeneral);
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
