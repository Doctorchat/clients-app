import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, MessageForm } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function MessagePage() {
  return <MessageForm />;
}

MessagePage.getLayout = function (page) {
  return (
    <Layout activeStep="doctor" title={i18next.t("describe_problem")} backPath="/registration-flow/select-doctor">
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
