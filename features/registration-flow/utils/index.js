import Router from "next/router";

import { MESSAGE_TYPES } from "@/context/constants";
import api from "@/services/axios/api";

const allowedPaths = ["/registration-flow/select-doctor", "message", "payment", "/home", "/chat", "/registration-flow/medical-centre"];

export const getUserRedirectPath = (user, pathname = "", isInvestigationFormAllowed = false) => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow" + window.location.search;
    }
    if (user?.company_id !== null && user?.is_verified_by_company === false) {
      return "/registration-flow/company-verification";
    }  
    if (allowedPaths.includes(pathname)) {
      return pathname;
    }    
    if (!isInvestigationFormAllowed) {
      return "/registration-flow/select-doctor";
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
    doctor_id: doctorPreviewId || 1,
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
      doctorPreviewId || "auto"
    }`
  );
  return true;
};
