import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, Popover, Badge, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios/api";
import { formatDateWithYearOption } from "@/utils/formatDate";
import PlusIcon from "@/icons/plus.svg";
import MyButton from "@/components/Button";

function PhysicalAppointmentsPage() {
  const { t } = useTranslation();

  const { data: consultations } = useQuery(["my-physical-consultations"], () =>
    api.user.myPhysicalConsultation().then((res) => res.data?.data)
  );

  const CONSULTATION_STATUS = useMemo(
    () => ({
      0: {
        label: t("status_booked"),
        badgeColor: "gold",
      },
      1: {
        label: t("status_confirmed"),
        badgeColor: "green",
      },
      2: {
        label: t("status_canceled"),
        badgeColor: "red",
      },
      3: {
        label: t("status_completed"),
        badgeColor: "blue",
      },
    }),
    [t]
  );

  return (
    <div id="physical-appointment-container" className="tw-relative tw-bg-white sidebar-body">
      <div className="scrollable scrollable-y">
        <div className="tw-sticky tw-top-0 tw-bg-white tw-h-12 tw-border-b tw-flex tw-items-center tw-px-5 tw-z-50">
          <Link href="/home" className="tw-flex tw-gap-2 tw-opacity-80 tw-items-center">
            <ArrowLeft size={20} />
            {t("back")}
          </Link>
        </div>

        <div className="tw-p-5">
          <div className="tw-mb-5 tw-flex tw-justify-end">
            <Link href="/registration-flow/select-doctor">
              <MyButton icon={<PlusIcon />} type="primary">
                {t("medical_centre:schedule_new_visit")}
              </MyButton>
            </Link>
          </div>

          <div className="tw-grid xl:tw-grid-cols-2 tw-gap-6">
            {consultations?.map((consultation) => (
              <Badge.Ribbon
                text={CONSULTATION_STATUS[consultation?.status]?.label}
                color={CONSULTATION_STATUS[consultation?.status]?.badgeColor}
                key={consultation?.id}
              >
                <div className="tw-p-3 tw-rounded-xl tw-border">
                  <div className="tw-flex tw-gap-2">
                    <Avatar
                      size={72}
                      shape="square"
                      className="tw-rounded-lg tw-flex-none"
                      src={consultation?.medical_centre?.logo?.url || "/images/default-logo-medical-centre.jpg"}
                    />
                    <div>
                      <div className="tw-font-medium tw-mr-14">{consultation?.medical_centre?.name}</div>
                      <div className="tw-opacity-80 tw-text-sm">
                        {consultation?.medical_centre?.address}, {consultation?.medical_centre?.city}
                      </div>
                      <a
                        href={`tel:${consultation?.medical_centre?.phone}`}
                        className="tw-font-medium tw-text-sm tw-text-primary"
                      >
                        {consultation?.medical_centre?.phone}
                      </a>
                    </div>
                  </div>

                  <div className="xs:tw-flex tw-items-center tw-justify-between tw-border-t mt-3 pt-3">
                    <div>
                      <div className="tw-text-gray-500">
                        {t("message_form_confirmation.datetime")}:{" "}
                        <span className="tw-text-gray-700 tw-font-medium">
                          {formatDateWithYearOption(consultation?.start_time)}
                        </span>
                      </div>
                      <div className="tw-text-gray-500">
                        {t("doctor")}:{" "}
                        <span className="tw-text-gray-700 tw-font-medium">{consultation?.doctor?.name}</span>
                      </div>
                    </div>

                    <Popover
                      content={
                        <div>
                          <div className="tw-text-gray-500">
                            {t("name")}:{" "}
                            <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.name}</span>
                          </div>
                          <div className="tw-text-gray-500">
                            {t("phone")}:{" "}
                            <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.phone}</span>
                          </div>
                          <div className="tw-text-gray-500">
                            {t("email")}:{" "}
                            <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.email}</span>
                          </div>
                        </div>
                      }
                      trigger="click"
                    >
                      <Button>{t("other_details")}</Button>
                    </Popover>
                  </div>
                </div>
              </Badge.Ribbon>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhysicalAppointmentsPage;
