import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import i18next from "i18next";
import PropTypes from "prop-types";

import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import LangIcon from "@/icons/lang.svg";
import api from "@/services/axios/api";
import getActiveLng from "@/utils/getActiveLng";

const langs = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

export default function ProfileChangeLang({ onUpdate }) {
  const user = useSelector((store) => store.user);
  const [changeLngLoading, setChangeLngLoading] = useState();
  const [dropdownForcedClose, setDropdownForcedClose] = useState(null);

  const changeLanguage = useCallback(
    (lng) => async () => {
      setChangeLngLoading(lng);

      if (user.isAuthorized) {
        await api.user.changeLocale(lng);
        window.location.reload();
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
      <Menu.Item
        icon={<span className="lang-icon">RU</span>}
        loading={changeLngLoading === "ru"}
        onClick={changeLanguage("ru")}
      >
        Русский
      </Menu.Item>
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
      className="lang-list-dropdown"
      placement="bottomRight"
      forcedClose={dropdownForcedClose}
    >
      <Menu.Item icon={<LangIcon />}>{langs[getActiveLng()]}</Menu.Item>
    </Dropdown>
  );
}

ProfileChangeLang.propTypes = {
  onUpdate: PropTypes.func,
};
