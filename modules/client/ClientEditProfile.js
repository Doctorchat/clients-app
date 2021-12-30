import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { editProfileSchema } from "@/services/validation";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";
import { updateUser } from "@/store/slices/userSlice";

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
      try {
        setFormEditConfig((prev) => ({ ...prev, general: { ...prev.general, loading: true } }));

        const response = await api.user.update(values);

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
