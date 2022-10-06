import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import TimesIcon from "@/icons/times.svg";
import WarnIcon from "@/icons/warning.svg";
import documnetPlaceholder from "@/imgs/doc.png";
import api from "@/services/axios/api";
import cs from "@/utils/classNames";
import formatBytes from "@/utils/formatBytes";

import { IconBtn } from "../Button";
import Image from "../Image";

import UploadContext from "./UploadContext";
import uploadHandler from "./uploadHandler";

export default function UploadFile(props) {
  const {
    file,
    file: { config },
    removeFile,
    updateFile,
    className,
  } = props;
  const { action, displayList, onFileUploaded, originalFileList } = useContext(UploadContext);
  const [animationStates, setAnimationStates] = useState({
    placeholder: false,
    file: false,
  });
  const [placeholder, setPlaceholder] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const animationPlaceholder = useRef();
  const progressRef = useRef();
  const fileRef = useRef();

  useEffect(() => setAnimationStates((prevState) => ({ ...prevState, placeholder: true })), []);

  useEffect(() => {
    if (!file.type.match(/image/g)) {
      setPlaceholder(documnetPlaceholder.src);
    }
  }, [file.type]);

  const onProgress = ({ percent }) => {
    const config = {
      uploading: true,
      uploaded: false,
      progress: percent,
    };

    updateFile({ config });
  };

  const onSuccess = (attach) => {
    const config = {
      uploading: false,
      uploaded: true,
      progress: "100.00",
    };

    if (file.url.startsWith("blob")) {
      URL.revokeObjectURL(file.url);
    }

    updateFile({ config, file_id: attach.id, url: attach.file_url });
    onFileUploaded(file.id);
  };

  const onError = (response) => {
    const config = {
      uploading: false,
      uploaded: false,
      progress: "0.00",
      error: response,
    };

    updateFile({ config });
    onFileUploaded(file.id);
  };

  const removeFileHandler = useCallback(async () => {
    if (file.file_id) {
      setRemoveLoading(true);
      await api.conversation.removeUpload(file.file_id);
      setRemoveLoading(false);
    }

    removeFile();
  }, [file.file_id, removeFile]);

  useEffect(() => {
    const { config } = file;
    const originalFileObj = originalFileList.find((attach) => attach.id === file.id);

    if (originalFileObj && !config.error && !config.uploading && !config.uploaded) {
      uploadHandler(originalFileObj.file, action, { onProgress, onSuccess, onError });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlaceholderEntered = () => {
    setAnimationStates((prevState) => ({ ...prevState, file: true }));
  };

  if (!displayList) return null;

  return (
    <>
      <CSSTransition
        in={animationStates.placeholder}
        timeout={200}
        nodeRef={animationPlaceholder}
        unmountOnExit
        onEntered={onPlaceholderEntered}
      >
        <div className="upload-list-item-animation-placeholder" ref={animationPlaceholder} />
      </CSSTransition>
      <CSSTransition in={animationStates.file} nodeRef={fileRef} timeout={200} unmountOnExit>
        <div
          className={cs("upload-list-item", className, config.error && "has-error")}
          ref={fileRef}
        >
          <div className="upload-file">
            <div className="upload-file-main">
              <div className="upload-file-preview">
                <Image alt={file.name} src={placeholder || file.url} w="50" h="50" />
              </div>
              <div className="upload-file-meta">
                <h5 className="file-name">
                  <span className="ellipsis">{file.name}</span>
                </h5>
                <div className="file-caption">
                  {config.error ? (
                    <div className="file-caption-error">
                      <span className="error-icon">
                        <WarnIcon />
                      </span>
                      <span className="error-msg">{config.error.message}</span>
                    </div>
                  ) : (
                    <div className="file-caption-info">
                      <span className={cs("ext", config.error?.type === "ext" && "error")}>
                        {file.ext}
                      </span>
                      <span className={cs("size", config.error?.type === "size" && "error")}>
                        {config.uploading ? config.progress + "%" : formatBytes(file.size)}
                      </span>
                    </div>
                  )}
                </div>
                <CSSTransition
                  nodeRef={progressRef}
                  timeout={200}
                  in={config.uploading}
                  unmountOnExit
                >
                  <div
                    className="file-progress"
                    ref={progressRef}
                    style={{ "--progress": config.progress + "%" }}
                  />
                </CSSTransition>
              </div>
            </div>
            <div className="upload-file-actions">
              <IconBtn
                className="file-remove-btn"
                onClick={removeFileHandler}
                loading={removeLoading}
                icon={<TimesIcon />}
              />
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

UploadFile.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.string,
    file_id: PropTypes.number,
    url: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
    ext: PropTypes.string,
    type: PropTypes.string,
    config: PropTypes.shape({
      progress: PropTypes.string,
      uploading: PropTypes.bool,
      uploaded: PropTypes.bool,
      error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          type: PropTypes.string,
          message: PropTypes.string,
        }),
      ]),
    }),
    originaFileObj: PropTypes.object,
  }),
  removeFile: PropTypes.func,
  className: PropTypes.string,
  updateFile: PropTypes.func,
};
