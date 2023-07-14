import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import FullPageLoading from "@/components/FullPageLoading";
import AuthWrapper from "@/containers/AuthWrapper";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function Authorize() {
  const { t } = useTranslation();

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.data);

  const verify = React.useCallback(async () => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code") ?? null;
    const authuser = params.get("authuser") ?? null;
    const scope = params.get("scope") ?? null;
    const prompt = params.get("prompt") ?? null;

    if ([code, authuser, scope, prompt].some((param) => param === null)) {
      return router.replace("/home");
    }

    try {
      await api.auth.google.verify({ user_id: user?.id, code, authuser, scope, prompt });
      dispatch(notification({ type: "success", title: "success", descrp: "google_calendar.authorized" }));
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      router.replace("/home");
    }
  }, [dispatch, router, user?.id]);

  React.useEffect(() => {
    verify();
  }, [verify]);

  return (
    <FullPageLoading>
      <p className="mt-3">{t("google_calendar.authorization")}...</p>
    </FullPageLoading>
  );
}

Authorize.getLayout = (page) => <AuthWrapper>{page}</AuthWrapper>;
