import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@/components/Alert";
import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Sidebar from "@/components/Sidebar";
import { leftSideTabs } from "@/context/TabsKeys";
import Tabs, { Line } from "@/packages/Tabs";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import TimePicker from "@/packages/TimePicker";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

import DocAppointmentsList from "./DocAppointmentsList";






const appointmentsTabs = {
  settings: "appointments-settings",
  list: "appointments-list",
};

export default function DocAppointmentsSettings() {
  const { disponibility } = useSelector((store) => ({
    disponibility: store.user.data.disponibility,
  }));
  const [appointmentsTabsConfig, setAppointmentsTabsConfig] = useState({
    key: Array.isArray(disponibility) ? appointmentsTabs.settings : appointmentsTabs.list,
    dir: "next",
  });
  const { updateTabsConfig } = useTabsContext();
  const [loading, setLoding] = useState(false);
  const form = useForm();
  const { t } = useTranslation();
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

  const updateAppointmentsTabsConfig = useCallback(
    (key, dir = "next") =>
      () => {
        setAppointmentsTabsConfig({ key, dir });
      },
    []
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title={t("video_appointments")}
          onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-appointments-wrapper">
          <Line
            activeKey={appointmentsTabsConfig.key}
            updateTabsConfig={updateAppointmentsTabsConfig}
            className="px-3"
          >
            <Line.Item title={t("settings")} dataKey={appointmentsTabs.settings} />
            <Line.Item title={t("appointments")} dataKey={appointmentsTabs.list} />
          </Line>
          <Tabs
            config={{ ...appointmentsTabsConfig }}
            updateTabsConfig={updateAppointmentsTabsConfig}
            dataAnimation="tabs"
          >
            <Tabs.Pane
              dataKey={appointmentsTabs.settings}
              unmountOnExit={false}
              withAnimation={!loading}
            >
              <div className="profile-appointments-box mt-3">
                <Alert
                  className="mb-4 mt-1"
                  type="info"
                  message={t('appintments_warning')}
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
                      {t("edit")}
                    </Button>
                  </div>
                </Form>
              </div>
            </Tabs.Pane>
            <Tabs.Pane dataKey={appointmentsTabs.list} withAnimation={!loading}>
              <DocAppointmentsList />
            </Tabs.Pane>
          </Tabs>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
