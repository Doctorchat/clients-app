import PropTypes from "prop-types";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import LangIcon from "@/icons/lang.svg";
import api from "@/services/axios/api";

export default function ProfileChangeLang({ onUpdate }) {
  const user = useSelector((store) => store.user);
  const { t } = useTranslation();
  const [changeLngLoading, setChangeLngLoading] = useState();
  const [dropdownForcedClose, setDropdownForcedClose] = useState(null);

  const changeLanguage = useCallback(
    (lng) => async () => {
      setChangeLngLoading(lng);

      if (user.isAuthorized) await api.user.changeLocale(lng);
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
      placement="topRight"
      forcedClose={dropdownForcedClose}
    >
      <Menu.Item icon={<LangIcon />}>{t("language")}</Menu.Item>
    </Dropdown>
  );
}

ProfileChangeLang.propTypes = {
  onUpdate: PropTypes.func,
};
