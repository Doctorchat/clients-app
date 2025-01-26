import React from "react";
import Link from "next/link";
import { ArrowLeft, EyeIcon } from "lucide-react";
import { Avatar, Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios/api";
import { Badge } from "antd";
import { formatDateWithYearOption } from "@/utils/formatDate";

const CONSULTATION_STATUS = {
  0: {
    label: "Rezervat",
    badgeColor: "pink",
  },
  1: {
    label: "Confirmat",
    badgeColor: "green",
  },
  2: {
    label: "Anulat",
    badgeColor: "red",
  },
  3: {
    label: "Finalizat",
    badgeColor: "blue",
  },
};

function PhysicalAppointmentsPage() {
  const { t } = useTranslation();

  const { data: consultations } = useQuery(["my-physical-consultations"], () =>
    api.user.myPhysicalConsultation().then((res) => res.data?.data)
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
                        Data:{" "}
                        <span className="tw-text-gray-700 tw-font-medium">
                          {formatDateWithYearOption(consultation?.start_time)}
                        </span>
                      </div>
                      <div className="tw-text-gray-500">
                        Medic: <span className="tw-text-gray-700 tw-font-medium">{consultation?.doctor?.name}</span>
                      </div>
                    </div>

                    <Popover
                      content={
                        <div>
                          <div className="tw-text-gray-500">
                            Nume: <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.name}</span>
                          </div>
                          <div className="tw-text-gray-500">
                            Telefon:{" "}
                            <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.phone}</span>
                          </div>
                          <div className="tw-text-gray-500">
                            Email: <span className="tw-text-gray-700 tw-font-medium">{consultation?.user?.email}</span>
                          </div>
                        </div>
                      }
                      trigger="click"
                    >
                      <Button>Detalii pacient</Button>
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
