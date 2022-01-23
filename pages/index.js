import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Alert from "@/components/Alert";
import AuthRoleWrapper from "@/containers/AuthRoleWrapper";
import { userRoles } from "@/context/constants";

function Home() {
  const user = useSelector((store) => store.user.data);
  const { t } = useTranslation();

  return (
    <div className="select-chat">
      <div className="p-4" style={{ maxWidth: 540 }}>
        <AuthRoleWrapper extraValidation={user?.status === false} roles={[userRoles.get("doctor")]}>
          <Alert
            type="warn"
            message={
              <>
                <strong>{t("feedback_form.warn_title")}</strong> <br />
                {t("feedback_form.warn_subtitle")}
              </>
            }
          />
        </AuthRoleWrapper>
      </div>
    </div>
  );
}

export default Home;
