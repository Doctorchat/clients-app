import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffectOnce } from "usehooks-ts";

import FullPageLoading from "@/components/FullPageLoading";
import { Layout, RegistrationForm } from "@/features/registration-flow";
import i18next from "@/services/i18next";
import { fetchUserByToken, getBootstrapData } from "@/store/actions";

export default function RegistrationPage() {
  const [isPhoneConfirmationStep, setIsPhoneConfirmationStep] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const updateStepStatus = React.useCallback(
    (user) => {
      if (user.role === 2) {
        return router.replace("/home");
      }

      if (!user.verified) {
        return setIsPhoneConfirmationStep(true);
      }

      if (user?.company_id !== null && user?.is_verified_by_company === false) {
        return router.replace("/registration-flow/company-verification");
      }

      if (user.verified) {
        router.replace("/registration-flow/select-doctor" + window.location.search);
      }

      return router.replace("/registration-flow/select-doctor");
    },
    [router]
  );

  useEffectOnce(() => {
    const accessToken = localStorage.getItem("dc_token");

    if (accessToken) {
      dispatch(fetchUserByToken())
        .then((user) => {
          updateStepStatus(user);
        })
        .finally(() => {
          dispatch(getBootstrapData()).finally(() => setLoading(false));
        });
    } else setLoading(false);
  });

  if (isLoading) {
    return <FullPageLoading />;
  }

  return <RegistrationForm isPhoneConfirmationStep={isPhoneConfirmationStep} updateStepStatus={updateStepStatus} />;
}

RegistrationPage.getLayout = function (page) {
  return (
    <Layout activeStep="account" title={i18next.t("wizard:tell_about_you")} backPath="/auth/login">
      {page}
    </Layout>
  );
};
