import { useCallback, useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { getMessaging, onMessage } from 'firebase/messaging';
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";

import FullPageLoading from "@/components/FullPageLoading";
import { getUserRedirectPath } from "@/features/registration-flow";
import useFcmToken from '@/hooks/useFcmToken'
import { fetchUserByToken, getBootstrapData } from "@/store/actions";
import firebaseApp from '@/utils/firebase/firebase';

import 'firebase/messaging';

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


  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);
      console.log(messaging)
      const unsubscribe = onMessage(messaging, (payload) => {
        
        console.log('Foreground push notification received:', payload);
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
         console.log(unsubscribe, "unsubscribe")
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);
const { fcmToken,notificationPermissionStatus } = useFcmToken();
  useEffectOnce(() => {
    const accessToken = localStorage.getItem("dc_token");
    const { doctorPreviewId, chatType } = router.query;
    const isInvestigationFormAllowed = doctorPreviewId || chatType;

    if (accessToken) {
      dispatch(fetchUserByToken())
        .then((user) => {
          
  // Use the token as needed
  fcmToken && console.log('FCM token:', fcmToken);
  console.log(notificationPermissionStatus, "notificationPermissionStatus")
      //TODO: Here after login
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
