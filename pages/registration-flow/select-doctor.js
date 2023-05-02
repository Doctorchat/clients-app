import { cloneElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthWrapper from "@/containers/AuthWrapper";
import { Layout, SelectDoctor } from "@/features/registration-flow";
import i18next from "@/services/i18next";
import { getConversationList } from "@/store/actions";

export default function SelectDoctorPage() {
  return <SelectDoctor />;
}

SelectDoctorPage.getLayout = function (page) {
  return (
    <CheckConversations>
      <Layout activeStep="doctor" title={i18next.t("wizard:available_doctors")} disableResponsiveRestriction>
        <AuthWrapper>{page}</AuthWrapper>
      </Layout>
    </CheckConversations>
  );
};

// Jira Ticket: DOC-380

// The CheckConversations component checks whether there are any conversations in the store and conditionally renders the children with a "backPath" prop set to "/home" if there are any.
const CheckConversations = ({ children }) => {
  const dispatch = useDispatch();
  const { data: conversations } = useSelector((store) => store.conversationList);

  const showBackButton = conversations?.length > 1;

  useEffect(() => {
    if (showBackButton) return;

    dispatch(getConversationList());
  }, [showBackButton]);

  if (showBackButton) {
    return cloneElement(children, { backPath: "/home" });
  }

  return children;
};
