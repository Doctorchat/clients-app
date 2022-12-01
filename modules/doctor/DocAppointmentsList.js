import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import AppointmentItem from "@/components/AppointmentItem";
import EmptyBox from "@/components/EmptyBox";
import Spinner from "@/components/Spinner";
import api from "@/services/axios/api";
import { getMeetingsList } from "@/store/actions";

export default function DocAppointmentsList() {
  const { meetingsList } = useSelector((store) => ({
    meetingsList: store.meetingsList,
  }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!meetingsList.data.length) {
      dispatch(getMeetingsList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const { data: activeAppointments, isLoading: areActiveAppointmentsLoading } = useQuery(
    () => api.user.meetings(),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: finishedAppointments, isLoading: areFinishedAppointmentsLoading } = useQuery(
    () => api.user.meetings(),
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="ps-2 mb-2">Programări Active</h6>
        <div className="sidebar-list d-flex flex-column">
          {activeAppointments?.data?.map((appointment) => (
            <AppointmentItem key={appointment.id} {...appointment} />
          ))}
          {areActiveAppointmentsLoading && <Spinner className="mt-3" />}
          {!areActiveAppointmentsLoading && !activeAppointments?.data?.length && (
            <EmptyBox className="mt-3" content={false} />
          )}
        </div>
      </div>
      <h6 className="ps-2 mb-2">Programări Finisate</h6>
      <div className="sidebar-list d-flex flex-column">
        {finishedAppointments?.data?.map((appointment) => (
          <AppointmentItem key={appointment.id} completed {...appointment} />
        ))}
        {areFinishedAppointmentsLoading && <Spinner className="mt-3" />}
        {!areFinishedAppointmentsLoading && !finishedAppointments?.data?.length && (
          <EmptyBox className="mt-3" content={false} />
        )}
      </div>
    </div>
  );
}

const appointments = [
  {
    id: 1,
    date: "2021.05.01",
    time: "10:00",
    url: "app/1",
  },
  {
    id: 2,
    date: "2021.05.01",
    time: "11:00",
    url: "app/2",
  },
];
