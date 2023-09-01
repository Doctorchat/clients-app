import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as yup from "yup";

import Alert from "@/components/Alert";
import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { InputNumber } from "@/components/Inputs";
import Menu from "@/components/Menu";
import Sidebar from "@/components/Sidebar";
import { leftSideTabs } from "@/context/TabsKeys";
import useApiErrorsWithForm from "@/hooks/useApiErrorsWithForm";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import CalendarDaysIcon from "@/icons/calendar-days.svg";
import ExternalLinkIcon from "@/icons/external-link.svg";
import Tabs, { Line } from "@/packages/Tabs";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import TimePicker from "@/packages/TimePicker";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

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
  const { t } = useTranslation();

  const user = useSelector((store) => store.user.data);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isGoogleCalendarAuthorizing, setIsGoogleCalendarAuthorizing] = useState(false);

  const dispatch = useDispatch();
  const resolver = useYupValidationResolver(schema);
  const form = useForm({ resolver });
  const setFormApiErrors = useApiErrorsWithForm(form, dispatch);

  const onFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);

        await api.user.disponibility(values);

        dispatch(updateUserProperty({ prop: "disponibility", value: values }));
        dispatch(notification({ title: "Succes", descrp: "Date au fost actualizate cu succes" }));
      } catch (error) {
        setFormApiErrors(error);
      } finally {
        setLoading(false);
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

  const unauthorizeGoogleCalendar = useCallback(async () => {
    try {
      setIsGoogleCalendarAuthorizing(true);
      await api.auth.google.cancel();
      dispatch(updateUserProperty({ prop: "g-auth", value: false }));
      dispatch(notification({ type: "success", title: "success", descrp: "google_calendar.unauthorized" }));
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setIsGoogleCalendarAuthorizing(false);
    }
  }, [dispatch]);

  const authorizeGoogleCalendar = useCallback(async () => {
    try {
      setIsGoogleCalendarAuthorizing(true);
      await router.push("https://api.doctorchat.md/authorize/start");
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setIsGoogleCalendarAuthorizing(false);
    }
  }, [dispatch, router]);

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
            <Tabs.Pane
              className={`first-pane ${appointmentsTabsConfig.key === appointmentsTabs.settings ? "active" : ""}`}
              dataKey={appointmentsTabs.settings}
              unmountOnExit={false}
              withAnimation={!loading}
            >
              <div className="profile-appointments-box mt-3 px-1">
                <Menu.Item
                  className="new-icon-style rounded bordered"
                  icon={<CalendarDaysIcon />}
                  loading={isGoogleCalendarAuthorizing}
                  onClick={user["g-auth"] ? unauthorizeGoogleCalendar : authorizeGoogleCalendar}
                >
                  <div className="d-flex align-items-center justify-content-between flex-grow-1">
                    {user["g-auth"] ? t("google_calendar.unauthorize") : t("google_calendar.authorize")}
                    <ExternalLinkIcon
                      style={{
                        color: "var(--bs-gray-600)",
                        width: "16px",
                      }}
                    />
                  </div>
                </Menu.Item>

                <Alert className="mb-4 mt-3" type="info" message={t("appintments_warning")} />
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
