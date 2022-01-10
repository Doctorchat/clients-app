import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import DocInfo from "@/components/DocInfo";
import BackTitle from "@/components/BackTitle";
import { getUserInfo } from "@/store/actions";
import { cleanUserInfo } from "@/store/slices/userInfoSlice";
import Sidebar from "@/components/Sidebar";
import { notification } from "@/store/slices/notificationsSlice";

export default function RightSide(props) {
  const { userId } = props;
  const {
    userInfo: { temp, cache, isLoading },
  } = useSelector((store) => ({ userInfo: store.userInfo }));
  const [docCurrentInfo, setDocCurrentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await dispatch(getUserInfo(userId));
      const data = await response();

      console.log(data);
    } catch (error) {
      dispatch(notification({ type: "error", title: "Eroare", descrp: "A apărut o eroare" }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (isLoading) {
      setDocCurrentInfo(temp);
    } else {
      const userInfo = cache.find((user) => user.id === 2);

      if (!userInfo) fetchUserInfo();
      else {
        setDocCurrentInfo(userInfo);
        setLoading(false);
      }
    }
  }, [temp, isLoading, cache, fetchUserInfo]);

  useEffect(() => {
    return () => {
      dispatch(cleanUserInfo());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="column-right">
      <Sidebar>
        <Sidebar.Header>
          <BackTitle title="Informație" />
        </Sidebar.Header>
        <Sidebar.Body>
          <div className="scrollable scrollable-y conversation-info-parts px-2">
            <DocInfo
              loading={loading}
              scrollableContainer="#column-right .conversation-info-parts"
              doctor={docCurrentInfo}
            />
          </div>
        </Sidebar.Body>
      </Sidebar>
    </div>
  );
}

RightSide.propTypes = {
  userId: PropTypes.number,
};
