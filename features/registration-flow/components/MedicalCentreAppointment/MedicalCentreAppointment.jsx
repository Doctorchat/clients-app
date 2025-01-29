import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Avatar, Calendar, notification, Spin } from "antd";
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
import api from "@/services/axios/api";

const userSchema = object().shape({
  email: string().required().min(5).max(50).email(),
  phone: string().required().min(9).max(50),
  name: string().required().min(2).max(50),
});

const MedicalCentreAppointment = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [spinning, setSpinning] = useState(false);
  const { push } = useRouter();

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const user = useSelector((store) => store.user.data);
  const doctorId = useMemo(() => searchParams.get("doctorId"), []);

  const { data: doctor, isLoading } = useDoctorPreview(doctorId);

  const resolver = useYupValidationResolver(userSchema);
  const form = useForm({ resolver });

  const onSubmit = async (data) => {
    const body = {
      physical_slot_id: selectedSlot?.id,
      ...data,
    };

    setSpinning(true);

    await api.user
      .bookSlot(body)
      .then(() => {
        notification.success({
          message: t("medical_centre:message_sent_successfully"),
          description: t("medical_centre:redirect_to_physical_appointments"),
          duration: 300,
        });
        push("/physical");
      })
      .catch(() => {
        notification.error({ message: t("default_error_message") });
      })
      .finally(() => {
        setSpinning(false);
      });
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
      <div className="tw-max-w-xl tw-mx-auto tw-px-4">
        {isLoading ? (
          <div className="tw-max-w-max tw-mx-auto">
            <Spin spinning />
          </div>
        ) : (
          <div className="tw-space-y-7">
            <div className="tw-space-y-2">
              <div className="tw-font-medium">{t("medical_centre:select_date")}</div>
              <div className="tw-border tw-rounded-xl tw-overflow-hidden">
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
            </div>

            <div className="tw-space-y-2">
              <div className="tw-font-medium">{t("medical_centre:select_time")}</div>

              <div className="tw-flex tw-flex-wrap tw-gap-2.5">
                {doctor?.slots?.map((slot) => {
                  const date = moment.utc(slot.start_time);

                  const isSelected = selectedSlot?.id === slot.id;
                  const isDisabled = date.isBefore(moment().add(1, "hour"));

                  return (
                    date.isSame(selectedDate, "day") && (
                      <button
                        key={slot?.id}
                        type="button"
                        disabled={isDisabled}
                        className={cn(
                          "tw-bg-gray-200 tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium tw-max-w-max",
                          "hover:tw-text-primary hover:tw-ring-1 tw-ring-primary hover:tw-disabled:tw-text-gray-300 tw-transition",
                          {
                            "tw-bg-gray-100 tw-text-gray-300 tw-cursor-not-allowed": isDisabled,
                            "tw-bg-primary tw-text-white hover:tw-text-white": isSelected,
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
              <div className="tw-space-y-2">
                <div className="tw-font-medium">{t("Informatie despre centrul medical")}</div>
                <div className="tw-flex tw-items-center tw-gap-2.5">
                  <Avatar
                    size={72}
                    src={
                      <img
                        src={selectedSlot?.medical_centre?.logo?.url || "/images/default-logo-medical-centre.jpg"}
                        alt="Logo"
                      />
                    }
                    className="tw-flex-none"
                  />
                  <div>
                    <div className="tw-font-medium">{selectedSlot?.medical_centre?.name}</div>
                    <div className="tw-opacity-70 tw-text-sm">
                      {selectedSlot?.medical_centre?.address}, {selectedSlot?.medical_centre?.city}
                    </div>
                    <div className="tw-font-medium tw-text-sm">{selectedSlot?.medical_centre?.phone}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="tw-space-y-2">
              <div className="tw-font-medium">{t("medical_centre:personal_data")}</div>

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

                <div className="tw-max-w-max tw-mx-auto">
                  <Button htmlType="submit" loading={spinning}>
                    {t("send")}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicalCentreAppointment;
