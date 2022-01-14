import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";
import LangIcon from "@/icons/lang.svg";
import api from "@/services/axios/api";

export default function ProfileChangeLang() {
  const { t } = useTranslation();
  const [changeLngLoading, setChangeLngLoading] = useState();
  const [dropdownForcedClose, setDropdownForcedClose] = useState(null);

  const changeLanguage = useCallback(
    (lng) => async () => {
      setChangeLngLoading(lng);

      await api.user.changeLocale(lng);

      setChangeLngLoading(null);

      localStorage.setItem("i18nextLng", lng);
      i18next.changeLanguage(lng);

      setDropdownForcedClose("__forced-close");
    },
    []
  );

  const options = (
    <Menu className="lang-items">
      <Menu.Item
        icon={<span className="lang-icon">RO</span>}
        loading={changeLngLoading === "ro"}
        onClick={changeLanguage("ro")}
      >
        RO
      </Menu.Item>
      <Menu.Item
        icon={<span className="lang-icon">RU</span>}
        loading={changeLngLoading === "ru"}
        onClick={changeLanguage("ru")}
      >
        RU
      </Menu.Item>
      <Menu.Item
        icon={<span className="lang-icon">EN</span>}
        loading={changeLngLoading === "en"}
        onClick={changeLanguage("en")}
      >
        EN
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={options} placement="topRight" forcedClose={dropdownForcedClose}>
      <Menu.Item icon={<LangIcon />}>{t("language")}</Menu.Item>
    </Dropdown>
  );
}
