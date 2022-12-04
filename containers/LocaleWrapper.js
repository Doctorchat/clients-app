import { useState } from "react";
import PropTypes from "prop-types";
import { useEffectOnce } from "usehooks-ts";

import FullPageLoading from "@/components/FullPageLoading";
import i18next from "@/services/i18next";

export default function LocaleWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("locale")) {
      i18next.changeLanguage(params.get("locale"));
      params.delete("locale");
      window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    }

    setIsLoading(false);
  });

  if (isLoading) {
    return <FullPageLoading />;
  }

  return children;
}

LocaleWrapper.propTypes = {
  children: PropTypes.node,
};
