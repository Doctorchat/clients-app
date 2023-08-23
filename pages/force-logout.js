import { logoutUser } from '@/store/actions';
import { useRouter } from 'next/router'
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
 
export default function ForceLogout() {
  const router = useRouter()
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => dispatch(logoutUser()), 1000)
  }, [])

  return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <p style={{ fontWeight: '700px', fontSize: '42px' }}>You have been logged out...</p>
  </div>
}

ForceLogout.getLayout = function (page) {
  return <>{page}</>;
};
