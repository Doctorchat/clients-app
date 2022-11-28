import { useTranslation } from "react-i18next";

import Input from "@/components/Inputs";
import Select from "@/components/Select";
import { diseasesOptions } from "@/context/staticSelectOpts";
import {
  DoctorCard,
  DoctorsGrid,
  DoctorViewDialog,
  useDoctorsInfiniteList,
} from "@/features/doctors";

import { OptionsDialog } from "./OptionsDialog";

export const SelectDoctor = () => {
  const { t } = useTranslation();

  const { data } = useDoctorsInfiniteList();

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
            <Input className="w-100" name="keyword" placeholder={t("wizard:search")} />
          </div>
        </div>
        <DoctorsGrid>
          {data.map((doctor) => (
            <DoctorCard key={doctor.id} {...doctor} />
          ))}
        </DoctorsGrid>
      </div>

      <DoctorViewDialog
        doctor={{
          id: 812,
          isOnline: false,
          name: "Maria Potrîmba",
          avatar: "https://api.doctorchat.md/uploads/avatars/1666785889.jpg",
          isGuard: true,
          isAvailable: true,
          category: [
            {
              id: 9,
              name_ro: "Dermatovenerologie",
              name_ru: "Дерматовенерология",
              name_en: "Dermatovenereology",
            },
          ],
          price: 200,
          meet_price: 300,
          activity: {
            likes: 100,
            responseTime: 267,
            helpedUsers: 2,
            testimonialsCount: 1,
            workplace: "IMSP",
            education: ['USMF "Nicolae Testemițanu"'],
          },
          about: {
            bio: {
              en: null,
              ro: "Consultaţii de dermatologie generala si pediatrica, diagnosticul si tratamentul bolilor cu transmitere sexuala.Analiza tenului si consiliere cosmetica",
              ru: null,
            },
            bio_ro:
              "Consultaţii de dermatologie generala si pediatrica, diagnosticul si tratamentul bolilor cu transmitere sexuala.Analiza tenului si consiliere cosmetica",
            bio_ru: null,
            bio_en: null,
            experience: 7,
            specialization: {
              ro: "Dermatovenerologie",
              ru: null,
              en: null,
            },
            specialization_ro: "Dermatovenerologie",
            specialization_ru: null,
            specialization_en: null,
            professionalTitle: "Medic dermatovenerolog",
          },
          disponibility: {
            fri: ["19:00", "22:00"],
            mon: ["19:00", "21:00"],
            sat: ["10:00", "22:00"],
            sun: ["10:00", "22:00"],
            thu: ["19:00", "21:00"],
            tue: ["19:00", "21:00"],
            wed: ["19:00", "21:00"],
          },
          reservations: [],
          vacation: [],
          hidden: false,
          status: true,
          locale: "ro",
          role: 2,
          last_seen: "2022-11-26 22:02:53",
        }}
      />
      <OptionsDialog />
    </>
  );
};
