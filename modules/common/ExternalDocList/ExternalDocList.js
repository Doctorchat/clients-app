import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Popup from "@/components/Popup";
import DocInfo from "@/components/DocInfo";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";

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

        dispatch(notification({ type: "error", titile: "error", descrp: "default_error_message" }));
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
        />
      </Popup.Content>
    </Popup>
  );
}
