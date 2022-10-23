import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { notification } from "@/store/slices/notificationsSlice";
import validateFile from "@/utils/validateFile";

import { ALLOWED_FILE_TYPES } from "../constants";

export const AttachmentInputContext = React.createContext({});

export const useAttachmentInput = () => React.useContext(AttachmentInputContext);

export const AttachmentInputProvider = (props) => {
  const { children } = props;

  const [temporaryFile, setTemporaryFile] = React.useState(null);

  const dispatch = useDispatch();

  const prepareFile = React.useCallback(
    (file) => {
      if (file) {
        const fileErrors = validateFile(file, 10240, ALLOWED_FILE_TYPES);

        if (fileErrors) {
          dispatch(notification({ type: "error", title: "error", descrp: fileErrors.error_code }));
        } else {
          setTemporaryFile(file);
        }
      }

      fileInputRef.current.value = null;
    },
    [dispatch]
  );

  const onUploadInputChange = (e) => prepareFile(e.target.files[0]);
  const triggerUploadInput = () => fileInputRef.current && fileInputRef.current.click();

  const fileInputRef = React.useRef();

  return (
    <AttachmentInputContext.Provider
      value={{ temporaryFile, setTemporaryFile, triggerUploadInput }}
    >
      {children}
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileInputRef}
        accept={ALLOWED_FILE_TYPES}
        onChange={onUploadInputChange}
      />
    </AttachmentInputContext.Provider>
  );
};

AttachmentInputProvider.propTypes = {
  children: PropTypes.node,
};
