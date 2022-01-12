import PropTypes from "prop-types";
import { Provider } from "react-redux";
import Head from "next/head";
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
      </Head>
      <Provider store={store}>
        <NotificationsWrapper />
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
