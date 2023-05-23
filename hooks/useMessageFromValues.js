import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function useMessageFromValues(chatId) {
  const [values, setValues] = useLocalStorage(`message-form:${chatId}`);

  const resetValues = useCallback(() => {
    setValues(undefined);
    localStorage.removeItem(`message-form:${chatId}`);
  }, [chatId, setValues]);

  return {
    values,
    setValues: useCallback((v) => setValues((prev) => ({ ...prev, ...v })), [setValues]),
    resetValues,
  };
}
