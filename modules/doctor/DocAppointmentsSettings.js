import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import Alert from "@/components/Alert";
import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Sidebar from "@/components/Sidebar";
import { leftSideTabs } from "@/context/TabsKeys";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import Tabs, { Line } from "@/packages/Tabs";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import TimePicker from "@/packages/TimePicker";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";

import DocAppointmentsList from "./DocAppointmentsList";
import DocAppointmentsSlots from "./DocAppointmentsSlots";

const appointmentsTabs = {
  settings: "appointments-settings",
  list: "appointments-list",
  slots: "appointments-slots",
};

const schema = yup.object().shape({
  time_frame: yup.number().min(1).max(120).required(),
  time_buffer: yup.number().min(1).max(60).required(),
});

export default function DocAppointmentsSettings() {
  const { disponibility, time_buffer, time_frame } = useSelector((store) => ({
    disponibility: store.user.data.disponibility,
    time_buffer: store.user.data.time_buffer || "",
    time_frame: store.user.data.time_frame || "",
  }));
  const [appointmentsTabsConfig, setAppointmentsTabsConfig] = useState({
    key: Array.isArray(disponibility) ? appointmentsTabs.settings : appointmentsTabs.list,
    dir: "next",
  });
  const { updateTabsConfig } = useTabsContext();
  const [loading, setLoding] = useState(false);

  const resolver = useYupValidationResolver(schema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

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
        setFormApiErrors(error);
      } finally {
        setLoding(false);
      }
    },
    [dispatch, setFormApiErrors]
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
        <BackTitle title={t("video_appointments")} onBack={updateTabsConfig(leftSideTabs.conversationList, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-appointments-wrapper">
          <Line activeKey={appointmentsTabsConfig.key} updateTabsConfig={updateAppointmentsTabsConfig} className="px-1">
            <Line.Item title={t("settings")} dataKey={appointmentsTabs.settings} />
            <Line.Item title={t("appointments")} dataKey={appointmentsTabs.list} />
            <Line.Item title={t("slots")} dataKey={appointmentsTabs.slots} />
          </Line>
          <Tabs
            config={{ ...appointmentsTabsConfig }}
            updateTabsConfig={updateAppointmentsTabsConfig}
            dataAnimation="tabs"
          >
            <Tabs.Pane dataKey={appointmentsTabs.settings} unmountOnExit={false} withAnimation={!loading}>
              <div className="profile-appointments-box mt-3 px-1">
                <Alert className="mb-4 mt-1" type="info" message={t("appintments_warning")} />
                <Form
                  className="pb-3"
                  methods={form}
                  onFinish={onFormSubmit}
                  initialValues={
                    disponibility && Array.isArray(disponibility)
                      ? {}
                      : {
                          time_frame,
                          time_buffer,
                          ...disponibility,
                        }
                  }
                >
                  <Form.Item name="time_frame" label="Durata consultației (minute)">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item name="time_buffer" label="Interval între consultații (minute)">
                    <InputNumber />
                  </Form.Item>
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
            <Tabs.Pane dataKey={appointmentsTabs.slots} withAnimation={!loading}>
              <DocAppointmentsSlots />
            </Tabs.Pane>
          </Tabs>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
