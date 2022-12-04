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
    <div className="auth-layout doctorchat-v2">
      <div className="auth-layout__sections">
        <div className="auth-layout__content">
          <header className="auth-layout__header">
            <div>
              {t("wizard:welcome_to")}&nbsp;
              <a href="https://doctorchat.md/" target="_blank" rel="noopener noreferrer">
                Doctorchat
              </a>
            </div>
            <ProfileChangeLang />
          </header>
          <main className="auth-layout__main">{children}</main>
        </div>
        <div className="auth-layout__slider">
          <div className="auth-layout__slider-card">
            <p className="slider-card__descrpiption">{t("wizard:login_page_card_description")}</p>
            <div className="slider-card__meta">
              <h3 className="slider-card__title">Igor Cliuev</h3>
              <p className="slider-card__subtitle">Founder CEO</p>
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
