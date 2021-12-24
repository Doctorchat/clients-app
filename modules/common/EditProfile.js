import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { leftSideTabs } from "@/context/TabsKeys";
import Image from "@/components/Image";
import useComponentByRole from "@/hooks/useComponentByRole";
import { userRoles } from "@/context/constants";
import { IconBtn } from "@/components/Button";
import EditIcon from "@/icons/edit.svg";

export default function EditProflie() {
  const { updateTabsConfig } = useTabsContext();
  const { user } = useSelector((store) => ({ user: store.user }));
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
  return (
    <Sidebar>
      <Sidebar.Header>
        <BackTitle
          title="Editează Profilul"
          onBack={updateTabsConfig(leftSideTabs.profile, "prev")}
        />
      </Sidebar.Header>
      <Sidebar.Body>
        <div className="scrollable scrollable-y profile-edit-wrapper">
          <div className="profile-edit-avatar position-relative d-flex align-items-center justify-content-center mb-4">
            <div className="dialog-avatar">
              <Image src={user.data.avatar} alt={user.data.name} w="120" h="120" />
              <IconBtn icon={<EditIcon />} type="primary" className="profile-edit-avatar-action" />
            </div>
          </div>
          <div className="edit-profile">{EditProfileForms}</div>
        </div>
      </Sidebar.Body>
    </Sidebar>
  );
}
