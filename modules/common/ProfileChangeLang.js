import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import i18next from "i18next";
import PropTypes from "prop-types";

import { REGION_RO } from "@/components/ConditionalRender/ConditionalRender";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import useRegion from "@/hooks/useRegion";
import LangIcon from "@/icons/lang.svg";
import api from "@/services/axios/api";
import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";

const langs = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

export default function ProfileChangeLang({ className, onUpdate, placement = "bottomRight" }) {
  const user = useSelector((store) => store.user);
  const [changeLngLoading, setChangeLngLoading] = useState();
  const [dropdownForcedClose, setDropdownForcedClose] = useState(null);
  const [languages, setLanguages] = useState(langs);
  const region = useRegion();

  useEffect(() => {
    if (region === REGION_RO && languages.ru) {
      setLanguages((prevState) => {
        const { ru, ...newState } = prevState;
        return newState;
      });
    }
    if (region === REGION_RO && getActiveLng() === "ru") {
      changeLanguage("ro", true)();
    }
  }, [region]);

  const changeLanguage = useCallback(
    (lng, skipReload = false) =>
      async () => {
        setChangeLngLoading(lng);
        if (user.isAuthorized) {
          await api.user.changeLocale(lng);
          if (!skipReload) {
            window.location.reload();
          }
        }
        if (onUpdate) onUpdate(lng);
        setChangeLngLoading(null);

        localStorage.setItem("i18nextLng", lng);
        i18next.changeLanguage(lng);

        setDropdownForcedClose("__forced-close");
      },
    [onUpdate, user.isAuthorized]
  );

  const options = (
    <Menu className="lang-items">
      <Menu.Item
        icon={<span className="lang-icon">RO</span>}
        loading={changeLngLoading === "ro"}
        onClick={changeLanguage("ro")}
      >
        Română
      </Menu.Item>
      {languages?.ru && (
        <Menu.Item
          icon={<span className="lang-icon">RU</span>}
          loading={changeLngLoading === "ru"}
          onClick={changeLanguage("ru")}
        >
          Русский
        </Menu.Item>
      )}
      <Menu.Item
        icon={<span className="lang-icon">EN</span>}
        loading={changeLngLoading === "en"}
        onClick={changeLanguage("en")}
      >
        English
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={options}
      className={cs("lang-list-dropdown", className)}
      placement={placement}
      forcedClose={dropdownForcedClose}
    >
      <Menu.Item icon={<LangIcon />}>{languages[getActiveLng()]}</Menu.Item>
    </Dropdown>
  );
}

ProfileChangeLang.propTypes = {
  className: PropTypes.string,
  onUpdate: PropTypes.func,
  placement: PropTypes.string,
};
