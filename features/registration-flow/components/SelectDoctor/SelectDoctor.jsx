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
import { startConversation } from "@/features/registration-flow";
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

  const createChatHandler = async (chatType = CHAT_TYPES.standard, messageType = MESSAGE_TYPES.standard) => {
    const investigationId = user.investigations?.[0]?.id;

    if (!investigationId) {
      const query = { ...router.query, chatType, messageType };
      if (doctorPreviewId) {
        query.doctorPreviewId = doctorPreviewId;
      }
      const pathname = "/user/medical-records";
      return await router.push({ pathname, query }, undefined, { shallow: true });
    }

    await startConversation({ chatType, messageType, doctorPreviewId, investigationId });
  };

  const onAutoTypeClickHandler = async () => {
    setIsAutoTypeLoading(true);
    await createChatHandler(CHAT_TYPES.auto, MESSAGE_TYPES.standard);
    setIsAutoTypeLoading(false);
  };

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

        {pagination.hasNextPage && (
          <div className="select-doctor__pagination">
            <Button loading={pagination.isFetchingNextPage} onClick={pagination.fetchNextPage}>
              {t("wizard:load_more_doctors")}
            </Button>
          </div>
        )}
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
    </>
  );
};
