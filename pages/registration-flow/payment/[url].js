import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, Payment } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function PaymentPage() {
  return <Payment />;
}

PaymentPage.getLayout = function (page) {
  return (
    <Layout activeStep="confirmation" title={i18next.t("wizard:completion")}>
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
