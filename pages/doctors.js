import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";

import BackTitle from "@/components/BackTitle";
import { IconBtn } from "@/components/Button";
import { DocItemSkeleton } from "@/components/DocItem";
import DocList from "@/components/DocList";
import Dropdown from "@/components/Dropdown";
import List from "@/components/List";
import Menu from "@/components/Menu";
import Search from "@/components/Search/Search";
import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import BarsIcon from "@/icons/bars.svg";
import HomeIcon from "@/icons/home.svg";
import { ExternalDocList, ProfileChangeLang } from "@/modules/common";
import api from "@/services/axios/api";

export default function Doctors() {
  const [currentList, setCurrentList] = useState([]);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const {
    data: doctors,
    isFetching,
    isFetched,
    isError,
  } = useQuery(["doctors", i18n.language], () => api.docList.get({ external: true, locale: i18n.language }), {
    keepPreviousData: true,
    placeholderData: { data: [] },
  });

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(doctors.data);
  }, [doctors.data, searchConfig]);

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  const onDocClickHandler = useCallback((doc) => () => router.push(`/doctors?id=${doc.id}`), [router]);

  if (typeof window === "undefined") return null;

  return (
    <div className="external-doc-list">
      <ExternalDocList />
      <SidebarHeader>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item icon={<HomeIcon />} className="home-item">
                <Link href={HOME_PAGE_URL} target="_blank" rel="noreferrer noopener">
                  {t("home_page")}
                </Link>
              </Menu.Item>
              <ProfileChangeLang />
            </Menu>
          }
          placement="bottomRight"
        >
          <IconBtn size="sm" icon={<BarsIcon />} />
        </Dropdown>
        <BackTitle className="ms-2" title={t("list_of_doctor")} />
      </SidebarHeader>
      <div className="search-bar mb-3">
        <Search
          placeholder={t("conversation_search_placeholder")}
          localList={doctors.data}
          updateSearchConfig={updateSearchConfig}
          searchKeys={["name", "category"]}
        />
      </div>
      <List
        loadingConfig={{
          status: !isFetched && isFetching,
          skeleton: DocItemSkeleton,
          className: "doclist",
        }}
        errorConfig={{ status: isError }}
        emptyConfig={{
          status: !doctors.data.length,
          className: "pt-4",
          content: t("doctor_list_empty"),
        }}
      >
        <DocList onDocClick={onDocClickHandler} data={currentList} />
      </List>
    </div>
  );
}

Doctors.getLayout = function (page) {
  return <div className="external-docs-layout">{page}</div>;
};
