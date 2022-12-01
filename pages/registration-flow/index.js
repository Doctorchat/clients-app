import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Layout, RegistrationForm } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function RegistrationPage() {
  const user = useSelector((store) => store.user);
  const router = useRouter();

  React.useEffect(() => {
    if (user.isAuthorized || localStorage.getItem("dc_token")) {
      router.replace({ pathname: "/" });
    }
  }, [router, user.isAuthorized]);

  return <RegistrationForm />;
}

RegistrationPage.getLayout = function (page) {
  return (
    <Layout activeStep="account" title={i18next.t("wizard:tell_about_you")} backPath="/auth/login">
      {page}
    </Layout>
  );
};
