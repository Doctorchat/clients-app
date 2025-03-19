import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";

import ConditionalRender from "@/components/ConditionalRender";
import { REGION_MD, REGION_RO } from "@/components/ConditionalRender/ConditionalRender";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import { ProfileChangeLang } from "@/modules/common";
import axiosInstance from "@/services/axios/apiConfig";
import Link from "next/link";

export default function AuthLayout({ children }) {
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const { t } = useTranslation();
  

  useEffectOnce(() => {
    const { query } = router;

    if (query?.token) {
      localStorage.setItem("dc_token", query.token);
      axiosInstance.defaults.headers.authorization = `Bearer ${query.token}`;
      router.replace({ pathname: "/auth/login" });
    }

    if (user.isAuthorized || localStorage.getItem("dc_token")) {
      router.replace({ pathname: "/" });
    }
  });

  const isAndroidDevies = navigator.userAgent.match(/Android/i);

  return (
    <div className="auth-layout doctorchat-v2">
      <div className="auth-layout__sections">
        <div className="auth-layout__content">
          <header className="auth-layout__header">
            <div>
              {t("wizard:welcome_to")}&nbsp;
              <a href={HOME_PAGE_URL} target="_blank" rel="noopener noreferrer">
                Doctorchat
              </a>
            </div>
            <ProfileChangeLang />
          </header>

          <main className="auth-layout__main">
            {children}
            {isAndroidDevies && 
              (<div className="tw-flex tw-justify-center">
                <Link className="tw-w-[160px] mt-4" href="intent://open#Intent;scheme=doctorchat;package=md.doctorchat;end;" rel="noreferrer noopener">
                  <img className="tw-rounded-lg tw-shadow-md" src="/images/google-play-btn.png" alt="Google Play" />
                </Link>
              </div>)
            }
          </main>
        </div>
        <div className="auth-layout__slider">
          <div className="auth-layout__slider-card">
            <ConditionalRender hideOnRegion={REGION_RO}>
              <p className="slider-card__descrpiption">{t("wizard:login_page_card_description")}</p>
            </ConditionalRender>

            <ConditionalRender hideOnRegion={REGION_MD}>
              <p className="slider-card__descrpiption">{t("wizard:login_page_card_description_ro.1")}</p>
              <p className="slider-card__descrpiption">{t("wizard:login_page_card_description_ro.2")}</p>
            </ConditionalRender>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
