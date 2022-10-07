import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";

const WalletTopupNotification = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const checkTopupHandler = useCallback(
    async (topupId) => {
      try {
        const response = await api.wallet.checkTopup(topupId);

        if (response.data.status) {
          dispatch(notification({ title: "success", descrp: "top_up_success" }));
        } else {
          dispatch(notification({ type: "error", title: "error", descrp: "top_up_error" }));
        }
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "top_up_error" }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (router.query.topped) {
      let as = "/";

      if (router.query.id) {
        as = `/chat${as}?id=${router.query.id}`;
      }

      checkTopupHandler(router.query.topped);
      router.replace(router.pathname, as, { shallow: true });
    }
  }, [router, checkTopupHandler]);

  return null;
};

export default WalletTopupNotification;
