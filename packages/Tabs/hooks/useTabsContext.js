import { useContext } from "react";
import TabsContext from "../context/TabsContext";

export default function useTabsContext() {
  const value = useContext(TabsContext);

  return value;
}
