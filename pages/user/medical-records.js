import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, MedicalRecordsForm } from "@/features/registration-flow";
import i18next from "@/services/i18next";

export default function MedicalRecordsPage() {
  return <MedicalRecordsForm />;
}

MedicalRecordsPage.getLayout = function (page) {
  return (
    <Layout activeStep="doctor" title={i18next.t("wizard:fill_in_medical_records")}>
      <AuthWrapper>{page}</AuthWrapper>
    </Layout>
  );
};
