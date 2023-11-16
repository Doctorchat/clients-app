import Router from "next/router";

import { MESSAGE_TYPES } from "@/context/constants";
import api from "@/services/axios/api";

const allowedPaths = ["select-doctor", "message", "payment"];

export const getUserRedirectPath = (user, pathname = "", isInvestigationFormAllowed = false) => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow" + window.location.search;
    }

    if (user?.company_id !== null && user?.is_verified_by_company === false) {
      return "/registration-flow/company-verification";
    }

    if (!user?.investigations?.length && !isInvestigationFormAllowed) {
      return "/registration-flow/select-doctor";
    }

    if (pathname.startsWith("/registration-flow") && allowedPaths.every((path) => !pathname.includes(path))) {
      return "/home";
    }
  }

  if (user.role === 2) {
    if (pathname.startsWith("/registration-flow")) {
      return "/home";
    }
  }

  return null;
};

export const startConversation = async ({ userId, doctorPreviewId, chatType, investigationId, messageType }) => {
  const res = await api.conversation.create({
    doctor_id: !!doctorPreviewId ? doctorPreviewId : 1,
    type: chatType,
    investigation_id: investigationId,
    isAnonym: false,
    isMeet: messageType === MESSAGE_TYPES.meet,
  });

  if (userId) {
    window.dataLayer?.push({
      event: "doc_selected",
      UserID: userId,
    });
  }

  await Router.push(
    `/registration-flow/message/${res.data.id}?chatType=${chatType}&messageType=${messageType}&doctorId=${
      doctorPreviewId ?? "auto"
    }`
  );
  return true;
};
