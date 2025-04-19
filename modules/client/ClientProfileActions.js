import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Confirm from "@/components/Confirm";
import Menu from "@/components/Menu";
import { leftSideTabs } from "@/context/TabsKeys";
import EditIcon from "@/icons/edit.svg";
import TrashIcon from "@/icons/trash.svg";
import GraduationCapIcon from "@/icons/graduation-cap.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { setUserUnauthorized } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

export default function ClientProfileActions() {
  const { updateTabsConfig } = useTabsContext();
  const { t } = useTranslation();

  const router = useRouter();
  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();

  const onRemoveAccount = useCallback(async () => {
    if (user && user.id) {
      try {
        await api.user.removeAccount({
          user_id: user.id,
        });
        dispatch(setUserUnauthorized());
        router.push("/auth/login");
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      }
    }
  }, [dispatch, router, user]);

  return (
    <Menu>
      <Menu.Item icon={<EditIcon />} onClick={updateTabsConfig(leftSideTabs.editProfile)}>
        {t("edit_profile")}
      </Menu.Item>
      <Confirm content={t("remove_account.description")} isAsync onConfirm={onRemoveAccount}>
        <Menu.Item icon={<TrashIcon />} className="logout-item">
          {t("remove_account.action")}
        </Menu.Item>
      </Confirm>
    </Menu>
  );
}
