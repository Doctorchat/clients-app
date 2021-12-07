import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByToken } from "@/store/actions";
import FullPageLoading from "@/components/FullPageLoading";

export default function AuthWrapper(props) {
  const { children } = props;
  const [isLoading, setLoading] = useState(true);
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const redirectToLogin = useCallback(() => {
    router.push({
      pathname: "/auth/login",
      query: { redirect: router.pathname },
    });
  }, [router]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(fetchUserByToken());
      setLoading(false);
    } catch (error) {
      redirectToLogin();
    }
  }, [dispatch, redirectToLogin]);

  useEffect(() => {
    if (localStorage.getItem("dc-token")) {
      if (!user?.id) {
        fetchUser();
      }
    } else redirectToLogin();
  }, [dispatch, fetchUser, redirectToLogin, user?.id]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return children;
}

AuthWrapper.propTypes = {
  children: PropTypes.any,
};
