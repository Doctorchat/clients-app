import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

import Button from "@/components/Button";
import { ConversationItemSkeleton } from "@/components/ConversationItem";
import ConversationList from "@/components/ConversationList";
import ConversationListHeader from "@/components/ConversationListHeader";
import List from "@/components/List";
import Sidebar from "@/components/Sidebar";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { ClientStartConversationMenu } from "@/modules/client";
import { getConversationList } from "@/store/actions";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { CalendarCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios/api";
import { formatDateWithYearOption, getClosestDate } from "@/utils/formatDate";
import GraduationCapIcon from "@/icons/graduation-cap.svg";

export default function ConversationsSidebar() {
  const { conversationList } = useSelector((store) => ({
    conversationList: store.conversationList,
  }));
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const user = useSelector((store) => store.user?.data);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { id } = router.query;
  const { updateTabsConfig } = useTabsContext();

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(conversationList.data);
  }, [conversationList.data, searchConfig]);

  const fetchConversationList = useCallback(() => dispatch(getConversationList()), [dispatch]);

  useEffect(() => {
    fetchConversationList();

    let interval = setInterval(fetchConversationList, 15000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role === userRoles.CLIENT) {
      if (conversationList.isLoaded && conversationList.data.length < 2) {
        router.push("/registration-flow/select-doctor");
      }
    }
  }, [conversationList.data.length, conversationList.isLoaded, router, user?.role]);

  const openStartConversation = useCallback(() => dispatch(docListToggleVisibility(true)), [dispatch]);

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  const isPhysicalPathname = useMemo(() => pathname === "/physical", [pathname]);

  const { data: consultations } = useQuery(["my-physical-consultations"], () =>
    api.user.myPhysicalConsultation().then((res) => res.data?.data)
  );

  // We don't need to fetch the tips count anymore since we're not displaying it

  const filteredConsultations = useMemo(
    () => consultations?.filter((item) => item?.status !== 2 && item?.status !== 3),
    [consultations]
  );

  const haveConsultations = useMemo(() => Boolean(filteredConsultations?.length), [filteredConsultations]);

  return (
    <Sidebar>
        <Sidebar.Header>
          <ConversationListHeader localList={currentList} updateSearchConfig={updateSearchConfig} />
        </Sidebar.Header>
        <Sidebar.Body>
          <div className="scrollable scrollable-y conversation-list-parts">
          <div className="tw-m-2">
            <Link
              href="/physical"
              className={cn(
                "tw-flex tw-gap-5 tw-items-center tw-justify-between tw-px-3 tw-py-2 tw-rounded-xl",
                "tw-bg-primary/5 tw-border tw-border-primary",
                "hover:tw-bg-primary/10 tw-transition",
                { "tw-bg-primary tw-text-white tw-pointer-events-none tw-cursor-not-allowed": isPhysicalPathname }
              )}
            >
              <span className="tw-w-full">
                <span
                  className={cn("tw-flex tw-gap-2 tw-items-center tw-font-semibold tw-text-primary", {
                    "tw-text-white": isPhysicalPathname,
                  })}
                >
                  <CalendarCheck size={20} strokeWidth={2.5} />
                  <span>{t("medical_centre:physical_appointments")}</span>
                </span>

                {haveConsultations && (
                  <span
                    className={cn("tw-flex tw-gap-2 tw-items-center tw-opacity-80 tw-text-sm", {
                      "tw-text-white": isPhysicalPathname,
                    })}
                  >
                    {t("next_visit")}:{" "}
                    {formatDateWithYearOption(getClosestDate(filteredConsultations?.map((item) => item?.start_time)))}
                  </span>
                )}
              </span>

              {haveConsultations && (
                <span
                  className={cn(
                    "tw-bg-primary tw-py-0.5 tw-px-1.5 tw-rounded-full tw-text-xs tw-font-semibold tw-text-white",
                    {
                      "tw-bg-white tw-text-primary": isPhysicalPathname,
                    }
                  )}
                >
                  {filteredConsultations?.length}
                </span>
              )}
            </Link>
          </div>
          
          <div className="tw-m-2 tw-mt-1">
            <div
              className={cn(
                "tw-flex tw-gap-5 tw-items-center tw-justify-between tw-px-3 tw-py-2 tw-rounded-xl tw-cursor-pointer",
                "tw-bg-emerald-50 tw-border tw-border-emerald-400",
                "hover:tw-bg-emerald-100 tw-transition"
              )}
              onClick={updateTabsConfig(leftSideTabs.tipOfTheDay)}
            >
              <span className="tw-w-full">
                <span className="tw-flex tw-gap-2 tw-items-center tw-font-semibold tw-text-emerald-600">
                  <GraduationCapIcon width={20} height={20} className="tw-fill-emerald-600" />
                  <span>{t("tip_of_the_day")}</span>
                </span>
              </span>
            </div>
          </div>

          <List
            loaded={conversationList.isLoaded}
            loadingConfig={{
              status: !currentList.length && conversationList.isLoading,
              skeleton: ConversationItemSkeleton,
            }}
            errorConfig={{
              status: conversationList.isError,
              extra: (
                <Button type="outline" onClick={window.location.reload}>
                  {t("reload_page")}
                </Button>
              ),
            }}
            emptyConfig={{
              status: !currentList.length,
              className: "pt-4",
              content: searchConfig.active ? t("search_not_found") : t("conversation_list_empty"),
              extra: (
                <AuthRoleWrapper roles={[userRoles.get("client")]}>
                  <ClientStartConversationMenu placement="bottomCenter">
                    <Button className="mt-3" onClick={openStartConversation}>
                      {t("select_doctor")}
                    </Button>
                  </ClientStartConversationMenu>
                </AuthRoleWrapper>
              ),
            }}
          >
            <ConversationList conversations={currentList} activeConversation={id} />
          </List>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
