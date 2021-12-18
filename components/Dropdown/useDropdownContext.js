import { useContext } from "react";
import DropdownContext from "./DropdownContext";

export default function useDropdownContext() {
  const value = useContext(DropdownContext);

  return value;
}
