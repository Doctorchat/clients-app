import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import TimePicker from "@/packages/TimePicker";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import Form from "@/components/Form";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

export default function DocAppointmentsSettings() {
  const { disponibility } = useSelector((store) => ({
    disponibility: store.user.data.disponibility,
  }));
  const { updateTabsConfig } = useTabsContext();
  const [loading, setLoding] = useState(false);
  const form = useForm();
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {
      try {
        setLoding(true);

        await api.user.disponibility(values);

        dispatch(updateUserProperty({ prop: "disponibility", value: values }));
        dispatch(notification({ title: "Succes", descrp: "Date au fost actualizate cu succes" }));
      } catch (error) {
        dispatch(notification({ type: "error", title: "Erorare", descrp: "A apărut o eroare" }));
      } finally {
        setLoding(false);
      }
    },
    [dispatch]
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title="Programări Video"
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-appointments-wrapper">
          <Alert
            className="mb-4 mt-1"
            type="info"
            message="Lăsați câmpurile necompletate pentru a indica că nu sunteți disponibil în ziua corespunzătoare"
          />
          <Form
            methods={form}
            onFinish={onFormSubmit}
            initialValues={disponibility && Array.isArray(disponibility) ? {} : disponibility}
          >
            <Form.Item name="mon" label="Luni">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="tue" label="Marți">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="wed" label="Miercuri">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="thu" label="Joi">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="fri" label="Vineri">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="sat" label="Sâmbătă">
              <TimePicker type="range" />
            </Form.Item>
            <Form.Item name="sun" label="Duminică">
              <TimePicker type="range" />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary" loading={loading}>
                Salvează
              </Button>
            </div>
          </Form>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
