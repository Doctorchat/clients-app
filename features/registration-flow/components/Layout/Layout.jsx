import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Button from "@/components/Button";
import ArrowLeftIcon from "@/icons/arrow-left.svg";
import { ProfileChangeLang } from "@/modules/common";
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

  const roter = useRouter();

  const onBackHandler = () => {
    roter.push(backPath);
  };

  return (
    <div
      className={cs(
        "registration-flow__layout",
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
        <ProfileChangeLang className="registration-flow__lang" placement="bottomLeft" />
      </header>
      <main className="registration-flow__content">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  activeStep: PropTypes.oneOf(["account", "doctor", "confirmation", "consultaion"]),
  title: PropTypes.string,
  backPath: PropTypes.string,
  disableResponsiveRestriction: PropTypes.bool,
  children: PropTypes.node,
};
