import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDoctor } from "../api";

const useDoctorPreview = (defaultDoctorPreviewId) => {
  const [doctorPreviewId, setDoctorPreviewId] = useState(defaultDoctorPreviewId);

  const { data, isLoading } = useQuery(
    ["doctor-view", doctorPreviewId],
    () => getDoctor(doctorPreviewId),
    { enabled: Boolean(doctorPreviewId) }
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
