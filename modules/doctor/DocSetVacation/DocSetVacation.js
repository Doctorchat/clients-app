import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "@/components/Popup";
import MenuItem from "@/components/Menu/MenuItem";
import PalmIcon from "@/icons/palm.svg";
import Portal from "@/containers/Portal";
import Form from "@/components/Form";
import DatePicker from "@/packages/DatePicker";
import Button from "@/components/Button";
import Confirm from "@/components/Confirm";

export default function DocSetVacation() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({ defaultValues: { range: null } });

  const openSetVacationForm = () => setIsOpen(true);

  const clearVacation = useMemo(() => {}, []);

  return (
    <>
      <MenuItem icon={<PalmIcon />} onClick={openSetVacationForm}>
        Concediu
      </MenuItem>
      <Portal portalName="modalRoot">
        <Popup id="vacation-form" visible={isOpen} onVisibleChange={setIsOpen}>
          <Popup.Header title="Setează concediu" />
          <Popup.Content>
            <Form methods={form}>
              <Form.Item label="Interval" name="range">
                <DatePicker type="range" />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Confirm content="Ești sigur că vrei să anulezi intervalul curent?">
                  <Button type="outline">Anulează</Button>
                </Confirm>
                <Button htmlType="submit">Setează</Button>
              </div>
            </Form>
          </Popup.Content>
        </Popup>
      </Portal>
    </>
  );
}
