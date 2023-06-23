import { useCallback } from "react";

export default function useGoogleRecaptcha() {
  const getRecaptchaToken = useCallback(async () => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY, { action: "submit" })
          .then((token) => resolve(token))
          .catch((error) => reject(error));
      });
    });
  }, []);

  return getRecaptchaToken;
}
