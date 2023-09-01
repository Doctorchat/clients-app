import { logoutUser } from '@/store/actions';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import Spinner from '@/components/Spinner';
 
export default function ForceLogout() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => dispatch(logoutUser()), 1000)
  }, [])

  return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <p style={{ fontWeight: '700px', fontSize: '42px' }}>{t("wizard:force_logout")}&nbsp; <Spinner /></p>
  </div>
}

ForceLogout.getLayout = function (page) {
  return <>{page}</>;
};
