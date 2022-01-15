import PropTypes from "prop-types";
import { Provider } from "react-redux";
import Head from "next/head";
import LocaleProvider from "antd/lib/locale-provider";
import ro_RO from 'antd/lib/locale-provider/ro_RO';
import { store } from "../store";
import MainLayout from "@/layouts/MainLayout";
import NotificationsWrapper from "@/containers/NotificationsWrapper";
import "@/services/i18next";

// Styles
import "../styles/global.scss";

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <MainLayout>{page}</MainLayout>
        <div id="modals-root" />
      </>
    ));

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>Doctorchat</title>
      </Head>
      <Provider store={store}>
        <LocaleProvider locale={ro_RO}>
          <NotificationsWrapper />
          {getLayout(<Component {...pageProps} />)}
        </LocaleProvider>
      </Provider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
