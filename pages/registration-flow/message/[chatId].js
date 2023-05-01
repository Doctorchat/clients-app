import { useRouter } from "next/router";
import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, MessageForm } from "@/features/registration-flow";
import i18next from "@/services/i18next";
import React from "react";
import api from "@/services/axios/api";

export default function MessagePage() {
  const router = useRouter();

  React.useEffect(() => {
    return () => {
      api.conversation.destroy(router.query.chatId).catch(() => {});
    };
  }, []);

  return <MessageForm />;
}

MessagePage.getLayout = function (page) {
  return (
    <Layout activeStep="doctor" title={i18next.t("describe_problem")} backPath="/registration-flow/select-doctor">
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
