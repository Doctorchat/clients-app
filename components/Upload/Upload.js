import { Children, cloneElement, forwardRef, useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";
import uniqId from "@/utils/uniqId";
import validateFile from "@/utils/validateFile";

import UploadContext from "./UploadContext";
import UploadFile from "./UploadFile";

const Upload = forwardRef((props, ref) => {
  const {
    name,
    description,
    label,
    icon,
    accept,
    onChange,
    fileItemClassName,
    displayList,
    target,
    action,
    fileList,
    setFileList,
  } = props;
  const [originalFileList, setOriginalFileList] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef();
  const listRef = useRef();

  const goToList = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const uploadPreparation = (files) => {
    const newFileList = [...fileList];
    const newOriginalFileList = [...originalFileList];

    for (let i = 0; i < files.length; i++) {
      const fileError = validateFile(files[i]);
      const uniq = uniqId();

      const file_ext = files[i].name.split(".");

      newOriginalFileList.push({ file: files[i], id: uniq });
      newFileList.push({
        id: uniq,
        url: URL.createObjectURL(files[i]),
        name: files[i].name,
        size: files[i].size,
        ext: file_ext[file_ext.length - 1],
        type: files[i].type,
        config: {
          error: fileError,
          progress: "0.00",
          uploading: false,
          uploaded: false,
        },
      });
    }

    fileInputRef.current.value = "";

    setFileList(newFileList);
    setOriginalFileList(newOriginalFileList);
    onChange(newFileList);
    goToList();
  };

  const initUploadMethod = () => fileInputRef.current && fileInputRef.current.click();
  const onUploadInputChange = () => uploadPreparation(fileInputRef.current.files);

  const onFileUploaded = useCallback(
    (fileId) => {
      const newOriginalFileList = originalFileList.filter((file) => file.id !== fileId);
      setOriginalFileList(newOriginalFileList);
    },
    [originalFileList]
  );

  const removeFileHandler = useCallback(
    (fileId) => () => {
      const newFileList = fileList.filter((file) => file.id !== fileId);
      setFileList(newFileList);
    },
    [fileList, setFileList]
  );

  const updateFileHandler = useCallback(
    (fileId) => (data) => {
      const newFileList = [...fileList];

      for (let i = 0; i < newFileList.length; i++) {
        if (fileId === newFileList[i].id) {
          newFileList[i] = { ...newFileList[i], ...data };
        }
      }

      setFileList(newFileList);
    },
    [fileList, setFileList]
  );

  // Drag & Drop
  const dragleave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);
  };

  const dragenter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(true);
  };

  const dragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const drop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);

    const dt = e.dataTransfer;
    const files = dt.files;

    uploadPreparation(files);
  };

  return (
    <div className="upload-container" ref={ref}>
      {target ? (
        cloneElement(Children.only(target), { onClick: initUploadMethod })
      ) : (
        <div className={cs("upload-drop-btn", isDragOver && "drag-in")} role="button">
          <div
            className="upload-handler"
            onDragLeave={dragleave}
            onDragEnter={dragenter}
            onDragOver={dragover}
            onDrop={drop}
            onClick={initUploadMethod}
          />
          <i className="upload-icon">{icon}</i>
          {label && <label className="upload-label">{label}</label>}
          {description && <span className="upload-descrp">{description}</span>}
        </div>
      )}

      <div className="upload-list" ref={listRef}>
        <UploadContext.Provider value={{ action, displayList, onFileUploaded, originalFileList }}>
          {fileList.map((file) => (
            <UploadFile
              key={file.id}
              className={fileItemClassName}
              file={file}
              removeFile={removeFileHandler(file.id)}
              updateFile={updateFileHandler(file.id)}
            />
          ))}
        </UploadContext.Provider>
      </div>
      <input
        type="file"
        id={name}
        ref={fileInputRef}
        accept={accept}
        onChange={onUploadInputChange}
      />
    </div>
  );
});

Upload.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.element,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  onFileListUpdate: PropTypes.func,
  fileItemClassName: PropTypes.string,
  displayList: PropTypes.bool,
  action: PropTypes.func,
  target: PropTypes.element,
  fileList: PropTypes.array,
  setFileList: PropTypes.func,
};

Upload.defaultProps = {
  onFileListUpdate: () => null,
  fileList: [],
};

Upload.displayName = "Upload";

export default Upload;
