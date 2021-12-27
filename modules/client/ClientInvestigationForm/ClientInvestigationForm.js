import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
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

export default function ClientInvestigationForm() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.investigationForm.isOpen,
  }));
  const resolver = useYupValidationResolver(investigationFormSchema);
  const form = useForm({ resolver });
  const dispatch = useDispatch();

  const visibilityHandler = (v) => dispatch(investigationFormToggleVisibility(v));

  const onSubmitHandler = useCallback((values) => {
    const data = { ...values };

    data.allergies = data.allergies.value;
    data.diseases = data.diseases.value;
    data.epidemiological = data.epidemiological.value;

    console.log(data);
  }, []);

  return (
    <Popup id="investigation-form" visible={isOpen} onVisibleChange={visibilityHandler}>
      <Popup.Header title="Adaugă o anchetă" />
      <Popup.Content>
        <Form methods={form} name="add-investigation" onFinish={onSubmitHandler}>
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
            <Button htmlType="submit">Adaugă</Button>
          </div>
        </Form>
      </Popup.Content>
    </Popup>
  );
}
