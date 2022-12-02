import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Input from "@/components/Inputs";
import Select from "@/components/Select";
import { CHAT_TYPES, MESSAGE_TYPES } from "@/context/constants";
import { diseasesOptions } from "@/context/staticSelectOpts";
import {
  DoctorCard,
  DoctorsGrid,
  DoctorViewDialog,
  useDoctorPreview,
  useDoctorsInfiniteList,
} from "@/features/doctors";
import api from "@/services/axios/api";

import { OptionsDialog } from "./OptionsDialog";

export const SelectDoctor = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user?.data);
  const router = useRouter();

  const { doctors, isLoading, filters, pagination } = useDoctorsInfiniteList();
  const {
    data: doctorPreview,
    isLoading: isDoctorPreviewLoading,
    doctorPreviewId,
    setDoctorPreviewId,
  } = useDoctorPreview();

  const createChatHandler = React.useCallback(
    async (chatType = CHAT_TYPES.standard, messageType = MESSAGE_TYPES.standard) => {
      const res = await api.conversation.create({
        doctor_id: doctorPreviewId,
        type: chatType,
        investigation_id: user?.investigations?.[0]?.id,
        isAnonym: false,
      });

      router.push(
        `/registration-flow/message/${res.data.id}?type=${messageType}&doctorId=${doctorPreviewId}`
      );
    },
    [doctorPreviewId, router, user?.investigations]
  );

  return (
    <>
      <div className="registration-flow__select-doctor">
        <div className="select-doctor__filters">
          <div className="select-doctor__filter">
            <label className="select-doctor__filter-label" htmlFor="category">
              {t("wizard:category")}
            </label>
            <Select name="category" options={diseasesOptions} />
          </div>
          <div className="select-doctor__filter">
            <label className="select-doctor__filter-label" htmlFor="keyword">
              {t("wizard:search_by_fullname")}
            </label>
            <Input
              className="w-100"
              name="keyword"
              placeholder={t("wizard:search")}
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
            />
          </div>
        </div>
        <DoctorsGrid isLoading={isLoading}>
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClickPreview={() => setDoctorPreviewId(doctor.id)}
            />
          ))}
        </DoctorsGrid>

        <div className="select-doctor__pagination">
          <Button loading={pagination.isFetchingNextPage} onClick={pagination.fetchNextPage}>
            {t("wizard:load_more_doctors")}
          </Button>
        </div>
      </div>

      {doctorPreviewId && (
        <DoctorViewDialog
          doctor={doctorPreview}
          isLoading={isDoctorPreviewLoading}
          onClose={() => setDoctorPreviewId(null)}
          onMessageTypeClick={() => createChatHandler(CHAT_TYPES.standard, MESSAGE_TYPES.standard)}
          onVideoTypeClick={() => createChatHandler(CHAT_TYPES.standard, MESSAGE_TYPES.meet)}
        />
      )}
      <OptionsDialog
        onAutoTypeClick={() => createChatHandler(CHAT_TYPES.auto, MESSAGE_TYPES.standard)}
      />
    </>
  );
};
