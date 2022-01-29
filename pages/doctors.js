import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import DocList from "@/components/DocList";
import api from "@/services/axios/api";
import List from "@/components/List";
import { DocItemSkeleton } from "@/components/DocItem";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    api.docList
      .get()
      .then((res) => {
        setDoctors(res.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="external-doc-list">
      <h3>Lista de doctori</h3>
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
        <DocList onDocClick={() => () => router.push("/")} data={doctors} />
      </List>
    </div>
  );
}

Doctors.getLayout = function (page) {
  return (
    <div className="external-docs-layout">
      <div className="auth-header-logo">
        <Link href="/">
          <a>
            <h3 className="m-3">Doctorchat</h3>
          </a>
        </Link>
      </div>
      {page}
    </div>
  );
};
