import Router from "next/router";

import { MESSAGE_TYPES } from "@/context/constants";
import api from "@/services/axios/api";

const allowedPaths = ["select-doctor", "medical-records", "message", "payment"];

export const getUserRedirectPath = (user, pathname = "") => {
  if (user.role === 3) {
    if (!user?.verified) {
      return "/registration-flow" + window.location.search;
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

export const startConversation = async ({ doctorPreviewId, chatType, investigationId, messageType }) => {
  const res = await api.conversation.create({
    doctor_id: doctorPreviewId ?? 1,
    type: chatType,
    investigation_id: investigationId,
    isAnonym: false,
    isMeet: messageType === MESSAGE_TYPES.meet,
  });

  await Router.push(
    `/registration-flow/message/${res.data.id}?chatType=${chatType}&messageType=${messageType}&doctorId=${
      doctorPreviewId ?? "auto"
    }`
  );
  return true;
};
