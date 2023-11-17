import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import Confirm from "@/components/Confirm";
import Home from "@/icons/home-icon.svg";
import ArrowLeftIcon from "@/icons/arrow-left.svg";
import LogoutIcon from "@/icons/logout.svg";
import { ProfileChangeLang } from "@/modules/common";
import { WalletFastTopUp } from "@/modules/common/Wallet/elements";
import { logoutUser } from "@/store/actions";
import cs from "@/utils/classNames";

import { Steps } from "../Steps";

export const Layout = ({ activeStep, title, backPath = "", disableResponsiveRestriction = false, children }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.data);

  const [isLogoutVisible, setIsLogoutVisible] = React.useState(false);

  const onBackHandler = () => {
    router.push(backPath);
  };

  const logoutHandler = () => dispatch(logoutUser());

  React.useEffect(() => {
    const onScrollToBottom = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        setIsLogoutVisible(true);
      } else {
        setIsLogoutVisible(false);
      }
    };

    onScrollToBottom();

    window.addEventListener("scroll", onScrollToBottom);

    return () => {
      window.removeEventListener("scroll", onScrollToBottom);
    };
  }, []);

  const showBackButton = !!backPath;
  const showWalletTopUp = activeStep === "doctor";

  return (
    <div
      className={cs("registration-flow__layout doctorchat-v2", disableResponsiveRestriction && "disable-restrictions")}
    >
      <header
        className={clsx("registration-flow__header", { "layout-full": showBackButton, "no-wallet": !showWalletTopUp })}
      >
        {showBackButton && (
          <Button
            className="registration-flow__back registration-flow__gray-btn"
            type="text"
            size="sm"
            icon={<ArrowLeftIcon />}
            onClick={onBackHandler}
          >
            {t("back")}
          </Button>
        )}
        <div className="registration-flow__wallet__home">
          {Object.keys(user).length 
            ? <Button
              className="registration-flow__primary"
              type="text"
              size="md"
              icon={<Home/> }
              onClick={()=>router.push("/home")}
              >
                Home
              </Button> 
            : null
          }
          <div
            style={{
              ...(user?.company_id
                ? {
                    visibility: "hidden",
                    pointerEvents: "none",
                  }
                : {}),
            }}
          >
            <WalletFastTopUp
              isVisible={showWalletTopUp}
              className={clsx("wallet-top-up", { "ms-md-5": !showBackButton })}
            />
          </div>
        </div>

        <Steps activeStep={activeStep} />

        <ProfileChangeLang className="registration-flow__lang me-md-5" placement="bottomLeft" />
      </header>
      <main className="registration-flow__content">
        <h1>{title}</h1>
        {children}
      </main>
      {isLogoutVisible && (
        <div className="registration-flow__logout_wrapper">
          <Confirm onConfirm={logoutHandler} content={t("logout_confirmation")} isAsync>
            <Button
              className={cs("registration-flow__logout registration-flow__gray-btn", isLogoutVisible && "show")}
              type="text"
              size="sm"
              icon={<LogoutIcon />}
            >
              {t("logout")}
            </Button>
          </Confirm>
        </div>
      )}
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
