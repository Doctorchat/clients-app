import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import AppointmentItem from "@/components/AppointmentItem";
import Button from "@/components/Button";
import EmptyBox from "@/components/EmptyBox";
import Spinner from "@/components/Spinner";
import api from "@/services/axios/api";
import cs from "@/utils/classNames";
import date from "@/utils/date";

export default function DocAppointmentsSlots() {
  const user = useSelector((state) => state.user?.data);
  const {
    data: slots,
    isLoading: areSlotsLoading,
    refetch,
  } = useQuery(["slots", user?.id], () => api.user.slots(user?.id), {
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  const onRemoveSlot = (slotId) => {
    api.user.removeSlot(slotId).then(() => refetch());
  };

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="ps-2 mb-2">Programări Active</h6>
        <div className="sidebar-list d-flex flex-column">
          {slots?.data?.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <div className="appointment-item__status" />
              <div className="appointment-item__caption">
                <span>Data consultației</span>
                <p>{date(appointment.start_time).full}</p>
              </div>
              <div className="appointment-item__action">
                <Button type="danger" size="sm" onClick={() => onRemoveSlot(appointment.id)}>
                  Șterge
                </Button>
              </div>
            </div>
          ))}
          {areSlotsLoading && <Spinner className="mt-3" />}
          {!areSlotsLoading && !slots?.data?.length && (
            <EmptyBox className="mt-3" content={false} />
          )}
        </div>
      </div>
    </div>
  );
}
