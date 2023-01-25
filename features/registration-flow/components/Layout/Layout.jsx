import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Button, { IconBtn } from "@/components/Button";
import DcTooltip from "@/components/DcTooltip";
import ArrowLeftIcon from "@/icons/arrow-left.svg";
import HomeIcon from "@/icons/home.svg";
import LangIcon from "@/icons/lang.svg";
import LogoutIcon from "@/icons/logout.svg";
import { ProfileChangeLang } from "@/modules/common";
import { logoutUser } from "@/store/actions";
import cs from "@/utils/classNames";

import { Steps } from "../Steps";

export const Layout = ({
  activeStep,
  title,
  backPath = "",
  disableResponsiveRestriction = false,
  children,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const onBackHandler = () => {
    router.push(backPath);
  };

  const logoutHandler = () => dispatch(logoutUser());

  return (
    <div
      className={cs(
        "registration-flow__layout doctorchat-v2",
        disableResponsiveRestriction && "disable-restrictions"
      )}
    >
      <header className="registration-flow__header">
        {backPath ? (
          <Button
            className="registration-flow__back registration-flow__gray-btn"
            type="text"
            size="sm"
            icon={<ArrowLeftIcon />}
            onClick={onBackHandler}
          >
            {t("back")}
          </Button>
        ) : (
          <div />
        )}
        <Steps activeStep={activeStep} />
        <div className="registration-flow__quick-actions">
          <ProfileChangeLang className="registration-flow__lang" placement="bottomLeft">
            <IconBtn size="sm" icon={<LangIcon />} />
          </ProfileChangeLang>
          <Link href="https://doctorchat.md/">
            <a>
              <DcTooltip side="bottom" align="end" content={t("home_page")} asChild>
                <IconBtn size="sm" icon={<HomeIcon />} onClick={logoutHandler} />
              </DcTooltip>
            </a>
          </Link>
          <DcTooltip side="bottom" align="end" content={t("logout")} asChild>
            <IconBtn
              className="registration-flow__logout"
              size="sm"
              icon={<LogoutIcon />}
              onClick={logoutHandler}
            />
          </DcTooltip>
        </div>
      </header>
      <main className="registration-flow__content">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  activeStep: PropTypes.oneOf(["account", "doctor", "confirmation", "consultation"]),
  title: PropTypes.string,
  backPath: PropTypes.string,
  disableResponsiveRestriction: PropTypes.bool,
  children: PropTypes.node,
};
