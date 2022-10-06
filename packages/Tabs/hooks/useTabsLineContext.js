import { useContext } from "react";

import LineContext from "../context/LineContext";

export default function useTabsLineContext() {
  const value = useContext(LineContext);

  return value;
}
