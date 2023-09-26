import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMessaging, onMessage } from "firebase/messaging";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";

import FullPageLoading from "@/components/FullPageLoading";
import { fetchToken } from "@/features/notification-firebase";
import { firebaseApp } from "@/features/notification-firebase/api/config";
import { getUserRedirectPath } from "@/features/registration-flow";
import { fetchUserByToken, getBootstrapData } from "@/store/actions";

import companyIcon from "../public/images/companyIcon.png";

export default function AuthWrapper(props) {
  const { children } = props;

  const [isLoading, setLoading] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const redirectToLogin = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const pathname = params.get("unauthorized_redirect") ?? "/auth/login";

    params.delete("unauthorized_redirect");

    router.push({
      pathname,
      query: { redirect: `${window.location.pathname}?${params.toString()}` },
    });
  }, [router]);
  console.log(router);
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received:", payload);

        // Extract data from the payload
        const { title, body } = payload.data;

        // Create a new notification
        const { id, pathname } = router;
        console.log(title, { body, icon: companyIcon });
        if (pathname !== "/chat") {
          new Notification(title, { body, icon: companyIcon });
          //body - > chatId si sa il pun https://app.doctorchat.md/chat?id='. $chatId
          // window.location.href = click_action;
        }
      });

      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  useEffectOnce(() => {
    const accessToken = localStorage.getItem("dc_token");
    const { doctorPreviewId, chatType } = router.query;
    const isInvestigationFormAllowed = doctorPreviewId || chatType;

    if (accessToken) {
      dispatch(fetchUserByToken())
        .then((user) => {
          fetchToken(user);
          const redirect = getUserRedirectPath(user, router.pathname, isInvestigationFormAllowed);
          if (redirect && redirect !== router.pathname) {
            router.replace(redirect);
          }
        })
        .catch(() => redirectToLogin())
        .finally(() => {
          dispatch(getBootstrapData()).finally(() => setLoading(false));
        });
    } else redirectToLogin();
  });

  if (isLoading) {
    return <FullPageLoading />;
  }

  return children;
}

AuthWrapper.propTypes = {
  children: PropTypes.any,
};
