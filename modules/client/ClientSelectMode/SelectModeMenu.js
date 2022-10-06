import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useDropdownContext } from "@/components/Dropdown";
import Menu from "@/components/Menu";
import { selectModeTabs } from "@/context/TabsKeys";
import CommentIcon from "@/icons/comment.svg";
import QuestionIcon from "@/icons/question.svg";
import UsersIcon from "@/icons/users.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { docListToggleVisibility } from "@/store/slices/docSelectListSlice";

export default function SelectModeMenu(props) {
  const { onSelect } = props;
  const { closeDropdown } = useDropdownContext();
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openStartConversation = () => {
    closeDropdown();
    dispatch(docListToggleVisibility(true));
  };

  const onSelectOptions = useCallback(
    (type, clbk) => () => {
      onSelect(type);
      clbk();
    },
    [onSelect]
  );

  return (
    <Menu className="select-mode-menu">
      <Menu.Item icon={<CommentIcon />} onClick={openStartConversation}>
        {t("select_doctor")}
      </Menu.Item>
      <Menu.Item
        icon={<QuestionIcon />}
        onClick={onSelectOptions("autoselect", updateTabsConfig(selectModeTabs.configureMessage))}
      >
        {t("dont_know_speciality")}
      </Menu.Item>
      <Menu.Item
        icon={<UsersIcon />}
        onClick={onSelectOptions("council", updateTabsConfig(selectModeTabs.configureMessage))}
        className="council-item"
      >
        {t("consilium")}
      </Menu.Item>
    </Menu>
  );
}

SelectModeMenu.propTypes = {
  onSelect: PropTypes.func,
};
