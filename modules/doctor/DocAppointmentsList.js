import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import List from "@/components/List";
import SidebarList from "@/components/SidebarList";
import { TransactionItemSkeleton } from "@/components/TransactionItem";
import { getMeetingsList } from "@/store/actions";
import AppointmentItem from "@/components/AppointmentItem";

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

  return (
    <List
      loaded={meetingsList.isLoaded}
      loadingConfig={{
        skeleton: TransactionItemSkeleton,
        status: meetingsList.isLoading,
      }}
      errorConfig={{
        status: meetingsList.isError,
      }}
      emptyConfig={{
        status: !meetingsList.data.length,
        className: "pt-4",
        content: t("appointments_list_empty"),
      }}
    >
      <SidebarList component={AppointmentItem} data={meetingsList.data} />
    </List>
  );
}
