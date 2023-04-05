import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import BackTitle from "@/components/BackTitle";
import { IconBtn } from "@/components/Button";
import Image from "@/components/Image";
import Sidebar from "@/components/Sidebar";
import { userRoles } from "@/context/constants";
import { leftSideTabs } from "@/context/TabsKeys";
import useComponentByRole from "@/hooks/useComponentByRole";
import EditIcon from "@/icons/edit.svg";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import validateFile from "@/utils/validateFile";

const avatarAcceptExts = ".png,.jpeg,.jpg";

export default function EditProflie() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { t } = useTranslation();
  const avatarInputRef = useRef();
  const EditProfileForms = useComponentByRole([
    {
      role: userRoles.get("client"),
      getComponent: async () => (await import("@/modules/client")).ClientEditProfile,
      props: { updateTabsConfig },
    },
    {
      role: userRoles.get("doctor"),
      getComponent: async () => (await import("@/modules/doctor")).DocEditProfile,
      props: { updateTabsConfig },
    },
  ]);
  const dispatch = useDispatch();

  const initUploadMethod = () => avatarInputRef.current && avatarInputRef.current.click();

  const updateProfileAvatar = useCallback(
    async (e) => {
      const file = e.target.files[0];
      const isInvalid = validateFile(file, 1024, avatarAcceptExts);
      setAvatarLoading(true);

      if (!isInvalid) {
        const formData = new FormData();
        formData.append("avatar", file);

        try {
          const response = await api.user.updateAvatar(formData);

          dispatch(updateUserProperty({ prop: "avatar", value: response.data.file_url }));
          dispatch(notification({ title: "success", descrp: "data_updated_with_success" }));
        } catch (error) {
          dispatch(
            notification({
              type: "error",
              title: "error",
              descrp: getApiErrorMessages(error, true),
            })
          );
        } finally {
          avatarInputRef.current.value = "";
          setAvatarLoading(false);
        }
      } else {
        dispatch(notification({ type: "error", title: "error", descrp: isInvalid.error_code }));
      }

      setAvatarLoading(false);
      avatarInputRef.current.value = "";
    },
    [dispatch]
  );

  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle title={t("edit_profile")} onBack={updateTabsConfig(leftSideTabs.profile, "prev")} />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-edit-wrapper">
          <div className="profile-edit-avatar position-relative d-flex align-items-center justify-content-center mb-4">
            <div className="dialog-avatar">
              <Image src={user.data.avatar} alt={user.data.name} w="120" h="120" />
              <IconBtn
                icon={<EditIcon />}
                type="primary"
                className="profile-edit-avatar-action"
                onClick={initUploadMethod}
                loading={avatarLoading}
              />
              <input
                type="file"
                className="d-none"
                ref={avatarInputRef}
                accept={avatarAcceptExts}
                onChange={updateProfileAvatar}
              />
            </div>
          </div>
          <div className="edit-profile">{EditProfileForms}</div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
