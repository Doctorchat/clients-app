import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Image from "../Image";
import { IconBtn } from "../Button";
import uploadHandler from "./uploadHandler";
import UploadContext from "./UploadContext";
import formatBytes from "@/utils/formatBytes";
import cs from "@/utils/classNames";
import documnetPlaceholder from "@/imgs/doc.png";
import TimesIcon from "@/icons/times.svg";
import WarnIcon from "@/icons/warning.svg";

export default function UploadFile(props) {
  const {
    file,
    file: { config },
    removeFile,
    updateFile,
    className,
  } = props;
  const { action, displayList } = useContext(UploadContext);
  const [animationStates, setAnimationStates] = useState({
    placeholder: false,
    file: false,
  });
  const [placeholder, setPlaceholder] = useState(null);
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

  const onSuccess = () => {
    const config = {
      uploading: false,
      uploaded: true,
      progress: "100.00",
    };

    updateFile({ config });
  };

  const onError = (response) => {
    const config = {
      uploading: false,
      uploaded: false,
      progress: "0.00",
      error: response,
    };

    updateFile({ config });
  };

  useEffect(() => {
    const { config, originaFileObj } = file;

    if (!config.error && !config.uploading && !config.uploaded) {
      uploadHandler(originaFileObj, action, { onProgress, onSuccess, onError });
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
              <IconBtn className="file-remove-btn" onClick={removeFile} icon={<TimesIcon />} />
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
