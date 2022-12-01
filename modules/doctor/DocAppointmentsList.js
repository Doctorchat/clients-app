import { useQuery } from "@tanstack/react-query";

import AppointmentItem from "@/components/AppointmentItem";
import EmptyBox from "@/components/EmptyBox";
import Spinner from "@/components/Spinner";
import api from "@/services/axios/api";

export default function DocAppointmentsList() {
  const { data: activeAppointments, isLoading: areActiveAppointmentsLoading } = useQuery(
    ["active-appointments"],
    () => api.user.meetings(),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: finishedAppointments, isLoading: areFinishedAppointmentsLoading } = useQuery(
    ["finished-appointments"],
    () => api.user.finishedMeetings(),
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
