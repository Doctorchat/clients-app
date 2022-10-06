import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { ProfileChangeLang } from "@/modules/common";
import axiosInstance from "@/services/axios/apiConfig";

export default function AuthLayout({ children }) {
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const { query } = router;

    if (query?.token) {
      localStorage.setItem("dc_token", query.token);
      axiosInstance.defaults.headers.authorization = `Bearer ${query.token}`;
      router.replace({ pathname: "/auth/login" });
    }

    if (user.isAuthorized || localStorage.getItem("dc_token")) {
      router.replace({ pathname: "/" });
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
                <div className="auth-layout-lang d-flex justify-content-center">
                  <ProfileChangeLang />
                </div>
                <a
                  href="https://doctorchat.md/termeni-si-conditii/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
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
