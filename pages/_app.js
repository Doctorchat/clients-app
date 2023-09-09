import React,  {  useEffect }  from "react";
import { Provider } from "react-redux";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConfigProvider from "antd/lib/config-provider";
import en_US from "antd/lib/locale-provider/en_US";
import ro_RO from "antd/lib/locale-provider/ro_RO";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import { getMessaging, onMessage } from 'firebase/messaging';
import Head from "next/head";
import PropTypes from "prop-types";

import LocaleWrapper from "@/containers/LocaleWrapper";
import NotificationsWrapper from "@/containers/NotificationsWrapper";
import useFcmToken from '@/hooks/useFcmToken'
import MainLayout from "@/layouts/MainLayout";
import firebaseApp from '@/utils/firebase/firebase';
import getActiveLng from "@/utils/getActiveLng";

import "@/services/i18next";
import 'firebase/messaging';

import { registerServiceWorker } from '../public/serviceWorker';
import { store } from "../store";

// Styles
import "../styles/index.scss";

const antLocales = {
  ro: ro_RO,
  ru: ru_RU,
  en: en_US,
};

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
   const { fcmToken,notificationPermissionStatus } = useFcmToken();
  // Use the token as needed
  fcmToken && console.log('FCM token:', fcmToken);
  console.log(notificationPermissionStatus, "notificationPermissionStatus")

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

  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <MainLayout>{page}</MainLayout>
        <div id="modals-root" />
      </>
    ));

  return (
    <LocaleWrapper>    
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <title>Doctorchat</title>
        </Head>
        <TooltipProvider delayDuration={0}>
          <Provider store={store}>
            <ConfigProvider locale={antLocales[getActiveLng()]}>
              <NotificationsWrapper />
              {getLayout(<Component {...pageProps} />)}
            </ConfigProvider>
          </Provider>
        </TooltipProvider>
      </QueryClientProvider>
    </LocaleWrapper>
  );
}
 registerServiceWorker()

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
