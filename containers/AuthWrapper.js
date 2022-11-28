import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";

import FullPageLoading from "@/components/FullPageLoading";
import { getUserRedirectPath } from "@/features/registration-flow";
import { fetchUserByToken, getBootstrapData } from "@/store/actions";

export default function AuthWrapper(props) {
  const { children } = props;

  const [isLoading, setLoading] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const redirectToLogin = useCallback(() => {
    router.push({
      pathname: "/auth/login",
      query: { redirect: router.pathname },
    });
  }, [router]);

  useEffectOnce(() => {
    const accessToken = localStorage.getItem("dc_token");

    if (accessToken) {
      dispatch(fetchUserByToken())
        .then((user) => {
          const redirect = getUserRedirectPath(user, router.pathname);

          if (redirect) {
            router.replace(redirect);
          }
        })
        .catch(() => redirectToLogin())
        .finally(() => {
          dispatch(getBootstrapData()).finally(() => setLoading(false));
        });
    } else redirectToLogin();
  });

  if (isLoading) {
    return <FullPageLoading />;
  }

  return children;
}

AuthWrapper.propTypes = {
  children: PropTypes.any,
};
