import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { notification } from "@/store/slices/notificationsSlice";

import { getDoctor } from "../api";

const useDoctorPreview = (defaultDoctorPreviewId) => {
  const [doctorPreviewId, setDoctorPreviewId] = useState(defaultDoctorPreviewId);

  const dispatch = useDispatch();

  const { data, isLoading } = useQuery(
    ["doctor-view", doctorPreviewId],
    async () => {
      try {
        const response = await getDoctor(doctorPreviewId);

        if (response?.vacation?.length && response.vacation.every(Boolean)) {
          const [start, end] = response.vacation.map((date) => dayjs(date, "DD.MM.YYYY").toDate().getTime());

          if (start <= Date.now() && Date.now() <= new Date(end)) {
            dispatch(notification({ type: "error", title: "error", descrp: "doctor_unavailable" }));
            setDoctorPreviewId(null);
            return null;
          }
        }

        return response;
      } catch {
        dispatch(notification({ type: "error", title: "error", descrp: "doctor_unavailable" }));
        setDoctorPreviewId(null);
        return null;
      }
    },
    {
      enabled: Boolean(doctorPreviewId),
      retry: false,
    }
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("doctor_id")) {
      setDoctorPreviewId(params.get("doctor_id"));
    }
  }, []);

  return { data, isLoading, doctorPreviewId, setDoctorPreviewId };
};

export default useDoctorPreview;
