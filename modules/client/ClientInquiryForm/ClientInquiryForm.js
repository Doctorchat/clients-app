import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Popup from "@/components/Popup";
import { messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import Form from "@/components/Form";
import Input, { InputNumber, Textarea } from "@/components/Inputs";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { inquiryFormSchema } from "@/services/validation";
import Select from "@/components/Select";
import {
  allergiesOptions,
  diseasesOptions,
  epidemiologicalOptions,
} from "@/context/staticSelectOpts";
import Button from "@/components/Button";
import { inquiryFormToggleVisibility } from "@/store/slices/inquiryFormSlice";

export default function ClientInquiryForm() {
  const { isOpen } = useSelector((store) => ({
    isOpen: store.inquiryForm.isOpen,
  }));
  const resolver = useYupValidationResolver(inquiryFormSchema);
  const form = useForm({ resolver });
  const dispatch = useDispatch();

  const visibilityHandler = (v) => dispatch(inquiryFormToggleVisibility(v));

  return (
    <Popup id="inquiry-form" visible={isOpen} onVisibleChange={visibilityHandler}>
      <Popup.Header title="Adaugă o anchetă" />
      <Popup.Content>
        <Form methods={form} name="add-inquiry" onFinish={(values) => console.log(values)}>
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
