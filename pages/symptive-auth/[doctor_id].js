import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import axiosInstance from "@/services/axios/apiConfig";
import i18next from "@/services/i18next";

export default function SymptiveAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const { doctor_id, token } = router.query;
    
    if (!doctor_id || !token) {
      return;
    }

    // Check if user is authenticated
    const accessToken = localStorage.getItem("dc_token");
    
    const redirectUrl = `/registration-flow/select-doctor?doctor_id=${doctor_id}&locale=en`;
    
    if (accessToken) {
      // User is authenticated, redirect directly
      router.replace(redirectUrl);
    } else {
      // User is not authenticated, decode the URL encoded token and set it like at login
      const decodedToken = decodeURIComponent(token);
      localStorage.setItem("dc_token", decodedToken);
      axiosInstance.defaults.headers.authorization = `Bearer ${decodedToken}`;
      
      // Set language to English
      i18next.changeLanguage("en");
      localStorage.setItem("i18nextLng", "en");
      
      router.replace(redirectUrl);
    }
  }, [router.query, router, dispatch]);

  return null; // This component doesn't render anything
}

// Make this a public route without AuthWrapper
SymptiveAuth.getLayout = function (page) {
  return page;
};