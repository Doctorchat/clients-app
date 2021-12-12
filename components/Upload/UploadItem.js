import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Image from "../Image/Image";
import { IconBtn } from "../Button";
import formatBytes from "@/utils/formatBytes";
import { messageUploadFile } from "@/store/actions";
import cs from "@/utils/classNames";
import DocImg from "@/imgs/doc.png";
import TimesIcon from "@/icons/times.svg";
import WarnIcon from "@/icons/warning.svg";

export default function UploadItem(props) {
  const {
    file,
    file: { fileError },
    removeFile,
    className,
    updateFile,
  } = props;
  const [animationStates, setAnimationStates] = useState({
    placeholder: false,
    file: false,
  });
  const [loading, setLoading] = useState(false);
  const [docFileURL, setDocFileURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const animationPlaceholder = useRef();
  const progressRef = useRef();
  const fileRef = useRef();

  useEffect(() => setAnimationStates((prevState) => ({ ...prevState, placeholder: true })), []);
  useEffect(() => {
    if (!file.fileType.match(/image/g)) {
      setDocFileURL(DocImg);
    }
  }, [file.fileType]);

  const onProgress = ({ percent }) => {
    setUploadProgress(Number(percent));
  };

  useEffect(() => {
    if (file.originaFileObj && !file.fileIsUploaded && !file.fileError) {
      const uploadFile = async () => {
        setLoading(true);

        await messageUploadFile(file.originaFileObj, 1, {
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
          },
        });

        setUploadProgress(0);
        updateFile({ fileIsUploaded: true });
        setLoading(false);
      };

      uploadFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlaceholderEntered = () => {
    setAnimationStates((prevState) => ({ ...prevState, file: true }));
  };

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
        <div className={cs("upload-list-item", className, fileError && "has-error")} ref={fileRef}>
          <div className="upload-file">
            <div className="upload-file-main">
              <div className="upload-file-preview">
                <Image alt={file.fileName} src={docFileURL?.src || file.fileURL} w="50" h="50" />
              </div>
              <div className="upload-file-meta">
                <h5 className="file-name">
                  <span className="ellipsis">{file.fileName}</span>
                </h5>
                <div className="file-caption">
                  {fileError ? (
                    <div className="file-caption-error">
                      <span className="error-icon">
                        <WarnIcon />
                      </span>
                      <span className="error-msg">{fileError.message}</span>
                    </div>
                  ) : (
                    <div className="file-caption-info">
                      <span className={cs("ext", fileError?.type === "ext" && "error")}>
                        {file.fileExt}
                      </span>
                      <span className={cs("size", fileError?.type === "size" && "error")}>
                        {loading ? uploadProgress + "%" : formatBytes(file.fileSize)}
                      </span>
                    </div>
                  )}
                </div>
                <CSSTransition nodeRef={progressRef} timeout={200} in={loading} unmountOnExit>
                  <div
                    className="file-progress"
                    ref={progressRef}
                    style={{ "--progress": uploadProgress + "%" }}
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

UploadItem.propTypes = {
  file: PropTypes.shape({
    fileURL: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    fileExt: PropTypes.string,
    fileError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        type: PropTypes.string,
        message: PropTypes.string,
      }),
    ]),
    fileType: PropTypes.string,
    originaFileObj: PropTypes.object,
    fileIsUploaded: PropTypes.bool,
  }),
  removeFile: PropTypes.func,
  className: PropTypes.string,
  updateFile: PropTypes.func,
};

UploadItem.defaultProps = {};
