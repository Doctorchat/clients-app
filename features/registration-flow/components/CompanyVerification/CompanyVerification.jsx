import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Link from "next/link";

export const CompanyVerification = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.data);

  return (
    <p className="company-verification-description">
      {t("wizard:company_verification_request.description", { name: user?.company?.name })}{" "}
      <Link href={`tel:+${user?.company?.contact_number}`} className="link">
        {user?.company?.contact_number}
      </Link>
      .
    </p>
  );
};
