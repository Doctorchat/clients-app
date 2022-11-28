import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, PhoneConfirmation } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function PhoneConfirmationPage() {
  return <PhoneConfirmation />;
}

PhoneConfirmationPage.getLayout = function (page) {
  return (
    <Layout activeStep="account" title={i18next.t("wizard:confirm_phone_number")}>
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
