import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import moment from "moment/moment";
import dayjs from "dayjs";
import getActiveLng from "@/utils/getActiveLng";
import { Calendar } from "antd";
import { useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import Form from "@/components/Form";
import Input, { Textarea } from "@/components/Inputs";
import { useTranslation } from "react-i18next";
import InputPhone from "../../../../components/Inputs/InputPhone";
import Button from "@/components/Button";

const userSchema = object().shape({
  email: string().required(),
});

const MedicalCentreAppointment = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const user = useSelector((store) => store.user.data);
  // const doctorId = useMemo(() => searchParams.get("doctorId"), []);

  const resolver = useYupValidationResolver(userSchema);
  const form = useForm({ resolver });

  const onSubmit = (data) => {
    console.log("onSubmit data", data);
  };

  console.log("[MedicalCentreAppointment]: user", user);
  return (
    <>
      <div>
        <Form
          className="registration-flow__form"
          methods={form}
          onFinish={onSubmit}
          initialValues={{ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" }}
        >
          <Form.Item name="name">
            <Input placeholder={t("message_form_placeholder")} />
          </Form.Item>
          <Form.Item name="phone">
            <InputPhone placeholder={t("message_form_placeholder")} />
          </Form.Item>
          <Form.Item name="email">
            <Input placeholder={t("message_form_placeholder")} />
          </Form.Item>

          <Button type="submit">OK</Button>
        </Form>
      </div>
      <div className="border rounded-xl overflow-hidden">
        <Calendar
          mode="month"
          fullscreen={false}
          headerRender={() => null}
          validRange={[moment(), moment().add(2, "week")]}
          // value={moment(selectedDate)}
          // onSelect={onChangeSelectedDate}
          // disabledDate={(date) => {
          //   return !data?.find((slot) => dayjs(slot.start_time).isSame(date, "day"));
          // }}
          // locale={antLocales[getActiveLng()]?.Calendar ?? antLocales.ro.Calendar}
        />
      </div>
    </>
  );
};

export default MedicalCentreAppointment;
