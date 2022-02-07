import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import DocList from "@/components/DocList";
import api from "@/services/axios/api";
import List from "@/components/List";
import { DocItemSkeleton } from "@/components/DocItem";
import Search from "@/components/Search/Search";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchConfig, setSearchConfig] = useState({
    list: [],
    active: false,
    loading: false,
  });
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (searchConfig.active) setCurrentList(searchConfig.list);
    else setCurrentList(doctors);
  }, [doctors, searchConfig]);

  useEffect(() => {
    api.docList
      .get()
      .then((res) => {
        setDoctors(res.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const updateSearchConfig = (actionType, value) => {
    setSearchConfig((prev) => ({ ...prev, [actionType]: value }));
  };

  return (
    <div className="external-doc-list">
      <h3>Lista de doctori</h3>
      <div className="search-bar mb-3">
        <Search
          placeholder={t("conversation_search_placeholder")}
          localList={doctors}
          updateSearchConfig={updateSearchConfig}
          searchKeys={["name", "category"]}
        />
      </div>
      <List
        loadingConfig={{
          status: loading,
          skeleton: DocItemSkeleton,
          className: "doclist",
        }}
        errorConfig={{ status: error }}
        emptyConfig={{
          status: !doctors.length,
          className: "pt-4",
          content: t("doctor_list_empty"),
        }}
      >
        <DocList onDocClick={() => () => router.push("/")} data={currentList} />
      </List>
    </div>
  );
}

Doctors.getLayout = function (page) {
  return <div className="external-docs-layout">{page}</div>;
};
