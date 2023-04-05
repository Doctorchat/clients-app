import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Input from "@/components/Inputs";
import Select from "@/components/Select";
import { CHAT_TYPES, MESSAGE_TYPES } from "@/context/constants";
import {
  DoctorCard,
  DoctorsGrid,
  DoctorViewDialog,
  useDoctorPreview,
  useDoctorsInfiniteList,
} from "@/features/doctors";
import api from "@/services/axios/api";
import { categoriesOptionsSelector } from "@/store/selectors";

export const SelectDoctor = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user?.data);
  const categories = useSelector((state) => categoriesOptionsSelector(state));

  const router = useRouter();

  const [isAutoTypeLoading, setIsAutoTypeLoading] = React.useState(false);

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
        doctor_id: doctorPreviewId ?? 1,
        type: chatType,
        investigation_id: user?.investigations?.[0]?.id,
        isAnonym: false,
        isMeet: messageType === MESSAGE_TYPES.meet,
      });

      router.push(
        `/registration-flow/message/${res.data.id}?chatType=${chatType}&messageType=${messageType}&doctorId=${
          doctorPreviewId ?? "auto"
        }`
      );
    },
    [doctorPreviewId, router, user?.investigations]
  );

  const onAutoTypeClickHandler = React.useCallback(async () => {
    setIsAutoTypeLoading(true);
    await createChatHandler(CHAT_TYPES.auto, MESSAGE_TYPES.standard);
    setIsAutoTypeLoading(false);
  }, [createChatHandler]);

  return (
    <>
      <div className="registration-flow__select-doctor">
        <div className="select-doctor__filters">
          <div className="select-doctor__filter">
            <label className="select-doctor__filter-label" htmlFor="category">
              {t("wizard:category")}
            </label>
            <Select
              name="speciality"
              options={[{ label: t("all"), value: "all" }, ...categories]}
              value={filters.speciality}
              onChange={filters.setSpeciality}
            />
          </div>
          <div className="select-doctor__filter">
            <label className="select-doctor__filter-label" htmlFor="search">
              {t("wizard:search_by_fullname")}
            </label>
            <Input
              className="w-100"
              name="search"
              placeholder={t("wizard:search")}
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
            />
          </div>
          <div className="select-doctor__filter">
            <Button loading={isAutoTypeLoading} onClick={onAutoTypeClickHandler}>
              {t("wizard:select_doctor.automatic.short_title")}
            </Button>
          </div>
        </div>
        <DoctorsGrid isLoading={isLoading}>
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onClickPreview={() => setDoctorPreviewId(doctor.id)} />
          ))}
        </DoctorsGrid>

        <div className="select-doctor__pagination">
          <Button
            disabled={!pagination.hasNextPage}
            loading={pagination.isFetchingNextPage}
            onClick={pagination.fetchNextPage}
          >
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
      {/* <OptionsDialog
        onAutoTypeClick={() => createChatHandler(CHAT_TYPES.auto, MESSAGE_TYPES.standard)}
      /> */}
    </>
  );
};
