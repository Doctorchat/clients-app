import { useCallback } from "react";

import i18next from "@/services/i18next";
import { notification } from "@/store/slices/notificationsSlice";
import snakeCase from "@/utils/snakeCase";

import getApiErrorMessages from "../utils/getApiErrorMessages";






/**
 * Set api errors to form fields via antd
 * @param form from antd Form (Form.useForm)
 * @returns {{setApiErrorsToAntdForm: function }}
 */
const useApiErrorsWithForm = (form, dispatch = null) => {
  const setApiErrorsToForm = useCallback(
    (error) => {
      const errors = getApiErrorMessages(error);

      if (Array.isArray(errors)) {
        errors.map(([name, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : msgs;
          const message_key = snakeCase(message);

          let final_message = "";

          if (i18next.exists(message_key)) {
            final_message = i18next.t(message_key);
          } else {
            final_message = message;
          }

          form.setError(name, { type: "custom", message: final_message });
        });

        return null;
      }

      if (dispatch) {
        dispatch(notification({ type: "error", title: "error", descrp: errors }));
      }
    },
    [dispatch, form]
  );

  return setApiErrorsToForm;
};

export default useApiErrorsWithForm;
