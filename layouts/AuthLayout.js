import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { t } from "i18next";

export default function AuthLayout({ children }) {
  const user = useSelector((store) => store.user);
  const router = useRouter();

  useEffect(() => {
    if (user.isAuthorized || localStorage.getItem("dc_token")) {
      router.push({
        pathname: "/",
      });
    }
  }, [router, user.isAuthorized]);

  return (
    <div className="auth-layout">
      <div className="auth-content">
        <div className="auth-sections">
          <div className="auth-background" />
          <div className="auth-main-content">
            <div className="auth-inner">
              {children}
              <div className="auth-bottom">
                <a href="#" target="_blank">
                  {t("terms_conditions")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
