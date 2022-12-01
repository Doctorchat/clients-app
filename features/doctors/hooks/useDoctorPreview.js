import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDoctor } from "../api";

const useDoctorPreview = (defaultDoctorPreviewId) => {
  const [doctorPreviewId, setDoctorPreviewId] = useState(defaultDoctorPreviewId);

  const { data, isLoading } = useQuery(
    ["doctor-view", doctorPreviewId],
    () => getDoctor(doctorPreviewId),
    { enabled: Boolean(doctorPreviewId) }
  );

  return { data, isLoading, doctorPreviewId, setDoctorPreviewId };
};

export default useDoctorPreview;
