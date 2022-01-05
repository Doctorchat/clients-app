import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "@/components/Popup";
import { investigationFormToggleVisibility } from "@/store/slices/investigationFormSlice";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { investigationFormSchema } from "@/services/validation";
import Select from "@/components/Select";
import {
  allergiesOptions,
  diseasesOptions,
  epidemiologicalOptions,
} from "@/context/staticSelectOpts";
import Button from "@/components/Button";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUser } from "@/store/slices/userSlice";

export default function ClientInvestigationForm() {
  const {
    investigationForm: { isOpen, isEditing, values },
  } = useSelector((store) => ({
    investigationForm: store.investigationForm,
  }));
  const [loading, setLoading] = useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const resolver = useYupValidationResolver(investigationFormSchema);
  const form = useForm({ resolver, values });
  const dispatch = useDispatch();

  const visibilityHandler = (v) => {
    if (!v) form.reset();
    dispatch(investigationFormToggleVisibility(v));
  };

  const onFormsValuesChanges = useCallback(() => {
    setFormEdited(true);
  }, []);

  const onAddNewInvestigation = async (data, { onSuccess, onError }) => {
    try {
      setLoading(true);

      const response = await api.user.addInvestigation(data);
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateInvestigation = async (data, { onSuccess, onError }) => {
    try {
      setLoading(true);

      const response = await api.user.updateInvestigation(data);
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = useCallback(
    async (values) => {
      const data = { ...values };

      data.sex = data.sex.value;
      data.epidemiological = data.epidemiological.value;
      data.diseases = data.diseases.value;
      data.allergies = data.allergies.value;

      const onSuccess = (response) => {
        dispatch(investigationFormToggleVisibility(false));
        dispatch(updateUser(response));
        dispatch(notification({ title: "Succes", descrp: "Date au fost actualizate cu succes" }));
      };

      const onError = () => {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
      };

      if (isEditing) {
        onUpdateInvestigation(data, { onSuccess, onError });
      } else {
        onAddNewInvestigation(data, { onSuccess, onError });
      }
    },
    [dispatch, isEditing]
  );

  return (
    <Popup
      id="investigation-form"
      visible={isOpen}
      onVisibleChange={visibilityHandler}
      confirmationClose={{ content: "Are you sure?", disabled: !formEdited }}
    >
      <Popup.Header title="Adaugă o anchetă" />
      <Popup.Content>
        <Form
          methods={form}
          name="add-investigation"
          onFinish={onSubmitHandler}
          onValuesChange={onFormsValuesChanges}
          initialValues={values}
        >
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" name="name" label="Nume">
              <Input placeholder="John" />
            </Form.Item>
            <Form.Item className="w-50" label="Gen" name="sex">
              <Select
                options={[
                  { value: "male", label: "Masculin" },
                  { value: "female", label: "Feminin" },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
            <Form.Item className="w-100" label="Vârsta" name="age">
              <InputNumber />
            </Form.Item>
            <Form.Item className="w-100" label="Înălțime(cm)" name="height">
              <InputNumber />
            </Form.Item>
            <Form.Item className="w-100" label="Greutate(kg)" name="weight">
              <InputNumber />
            </Form.Item>
          </div>
          <Form.Item label="Locul de trai" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="Gen de activitate(specificați)" name="activity">
            <Textarea />
          </Form.Item>
          <Form.Item
            label="Datele epidemiologice(dacă ați suportat boli infecțioase)"
            name="epidemiological"
          >
            <Select options={epidemiologicalOptions} />
          </Form.Item>
          <Form.Item
            label="Boli suportate pe toată perioada vieții(specificați dacă este cazul)"
            name="diseases"
          >
            <Select options={diseasesOptions} />
          </Form.Item>
          <Form.Item
            label="Boli suportate pe toată perioada vieții - specificați"
            name="diseases_spec"
          >
            <Textarea />
          </Form.Item>
          <Form.Item label="Alergii" name="allergies">
            <Select options={allergiesOptions} />
          </Form.Item>
          <Form.Item label="Cum se manifestă alergia(descrieți)" name="allergies_spec">
            <Textarea />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" loading={loading}>
              Adaugă
            </Button>
          </div>
        </Form>
      </Popup.Content>
    </Popup>
  );
}
