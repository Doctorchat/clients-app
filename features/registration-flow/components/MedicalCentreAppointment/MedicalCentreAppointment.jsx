import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Avatar, Calendar, Spin } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import { useSearchParams } from "next/navigation";
import { object, string } from "yup";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import InputPhone from "@/components/Inputs/InputPhone";
import { useDoctorPreview } from "@/features/doctors";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { antLocales } from "@/utils/antLocales";
import { cn } from "@/utils/cn";
import getActiveLng from "@/utils/getActiveLng";

const userSchema = object().shape({
  email: string().required(),
  phone: string().required(),
  name: string().required(),
});

const MedicalCentreAppointment = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [spinning, setSpinning] = useState(false);

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const user = useSelector((store) => store.user.data);
  const doctorId = useMemo(() => searchParams.get("doctorId"), []);

  const { data: doctor, isLoading } = useDoctorPreview(doctorId);

  const resolver = useYupValidationResolver(userSchema);
  const form = useForm({ resolver });

  const onSubmit = async (data) => {
    const body = {
      doctor_id: doctorId,
      medical_centre_id: selectedSlot?.medical_centre?.id,
      physical_slot_id: selectedSlot?.id,
      ...data,
    };

    setSpinning(true);
    console.log("onSubmit body", body);

    // await api.user.bookSlot(body);
  };

  const onChangeSelectedDate = useCallback((date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const onChangeSelectedSlot = useCallback((slot) => {
    setSelectedSlot(slot);
  }, []);

  useEffect(() => {
    if (doctor?.slots) {
      if (!doctor?.slots[0]?.start_time) return;
      setSelectedDate(moment(doctor?.slots[0].start_time));
    }
  }, [doctor]);

  return (
    <>
      <div className="max-w-xl mx-auto px-4">
        {isLoading ? (
          <div className="max-w-max mx-auto">
            <Spin spinning />
          </div>
        ) : (
          <div className="space-y-7">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="month"
                fullscreen={false}
                headerRender={() => null}
                disabledDate={(date) => {
                  return !doctor?.slots?.find((slot) => dayjs(slot.start_time).isSame(date, "day"));
                }}
                value={moment(selectedDate)}
                onSelect={onChangeSelectedDate}
                locale={antLocales[getActiveLng()]?.Calendar ?? antLocales.ro.Calendar}
              />
            </div>

            <div className="space-y-2">
              <div className="font-medium">{t("Selectati ora")}</div>

              <div className="flex flex-wrap gap-2.5">
                {doctor?.slots?.map((slot) => {
                  const date = dayjs(slot.start_time);
                  const isSelected = selectedSlot?.id === slot.id;
                  const isDisabled = date.isBefore(moment().add(1, "hour"));

                  return (
                    date.isSame(selectedDate, "day") && (
                      <button
                        key={slot?.id}
                        type="button"
                        disabled={isDisabled}
                        className={cn(
                          "bg-gray-200 px-2 py-1 rounded-full text-sm font-medium max-w-max",
                          "hover:text-dc-primary hover:ring-1 ring-dc-primary hover:disabled:text-gray-300 transition",
                          {
                            "bg-gray-100 text-gray-300 cursor-not-allowed": isDisabled,
                            "bg-dc-primary text-white": isSelected,
                          }
                        )}
                        onClick={() => {
                          if (!isDisabled) {
                            onChangeSelectedSlot(isSelected ? null : slot);
                          }
                        }}
                      >
                        {date.format("HH:mm")}
                      </button>
                    )
                  );
                })}
              </div>
            </div>

            {selectedSlot && (
              <div className="space-y-2">
                <div className="font-medium">{t("Informatie despre centrul medical")}</div>
                <div className="flex items-center gap-2.5">
                  <Avatar
                    size={72}
                    src={
                      <img
                        src={selectedSlot?.medical_centre?.logo?.url || "/images/default-logo-medical-centre.jpg"}
                        alt="Logo"
                      />
                    }
                    className="flex-none"
                  />
                  <div>
                    <div className="font-medium">{selectedSlot?.medical_centre?.name}</div>
                    <div className="opacity-70 text-sm">
                      {selectedSlot?.medical_centre?.address}, {selectedSlot?.medical_centre?.city}
                    </div>
                    <div className="font-medium text-sm">{selectedSlot?.medical_centre?.phone}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="font-medium">{t("Selectati ora")}</div>

              <Form
                methods={form}
                onFinish={onSubmit}
                initialValues={{ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" }}
              >
                <Form.Item name="name">
                  <Input placeholder={t("wizard:first_name/last_name")} />
                </Form.Item>
                <Form.Item name="phone">
                  <InputPhone placeholder={t("translation:phone")} />
                </Form.Item>
                <Form.Item name="email">
                  <Input placeholder={t("translation:email")} />
                </Form.Item>

                <Button htmlType="submit" loading={spinning}>
                  OK
                </Button>
              </Form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicalCentreAppointment;
