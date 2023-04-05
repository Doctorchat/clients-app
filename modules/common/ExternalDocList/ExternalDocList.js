import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import DocInfo from "@/components/DocInfo";
import Popup from "@/components/Popup";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function ExternalDocList() {
  const [visible, setVisible] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const { id: doc_id } = router.query;

  useEffect(() => {
    const fetchDocInfo = async () => {
      if (!doc_id) return;

      try {
        setLoading(true);

        const response = await api.user.card(doc_id);

        setDoctor(response.data);
        setVisible(true);
      } catch (error) {
        setVisible(false);
        setDoctor(null);

        dispatch(notification({ type: "error", titile: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(false);
      }
    };

    fetchDocInfo();
  }, [dispatch, doc_id]);

  const onPopupVisibleChange = useCallback(
    (status) => {
      setVisible(status);

      if (!status) {
        router.push("/doctors");
      }
    },
    [router]
  );

  const ActionBtn = useMemo(
    () => (
      <div className="start-conversation mt-1 d-flex justify-content-end">
        <Button size="sm" className="w-auto" onClick={() => router.push("/auth/login")}>
          {t("describe_problem")}
        </Button>
      </div>
    ),
    [router, t]
  );

  if (!doc_id) return null;

  return (
    <Popup id="external-doc-info" visible={visible} onVisibleChange={onPopupVisibleChange}>
      <Popup.Header title={t("information_about_doctor")} />
      <Popup.Content className="external-doc-info-body">
        <DocInfo
          loading={loading}
          scrollableContainer=".external-doc-info-body .popup-scroll-container"
          doctor={doctor}
          allowCreate={false}
          actionBtn={ActionBtn}
        />
      </Popup.Content>
    </Popup>
  );
}
