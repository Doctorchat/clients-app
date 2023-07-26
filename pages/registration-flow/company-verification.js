import AuthWrapper from "@/containers/AuthWrapper";
import { CompanyVerification, Layout } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function CompanyVerificationPage() {
  return <CompanyVerification />;
}

CompanyVerificationPage.getLayout = function (page) {
  return (
    <Layout activeStep="doctor" title={i18next.t("wizard:company_verification_request.title")}>
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
