import { useEffect } from "react";
import { useRouter } from "next/router";

const WalletTopupNotification = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.topup) {
      let as = "/";

      if (router.query.id) {
        as = `/chat${as}?id=${router.query.id}`;
      }

      router.replace(router.pathname, as, { shallow: true });
    }
  }, [router]);

  return null;
};

export default WalletTopupNotification;
