import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, SelectDoctor } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function SelectDoctorPage() {
  return <SelectDoctor />;
}

SelectDoctorPage.getLayout = function (page) {
  return (
    <Layout activeStep="doctor" title={i18next.t("wizard:available_doctors")} disableResponsiveRestriction>
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
