import PropTypes from "prop-types";
import { forwardRef, useCallback, useRef, useState } from "react";
import UploadContext from "./UploadContext";
import UploadFile from "./UploadFile";
import uniqId from "@/utils/uniqId";
import cs from "@/utils/classNames";
import validateFile from "@/utils/validateFile";

const REMOVE_FILE = Symbol("remove_file");
const ADD_FILE = Symbol("add_file");

const Upload = forwardRef((props, ref) => {
  const {
    name,
    description,
    label,
    icon,
    accept,
    onChange,
    onFileListUpdate,
    fileItemClassName,
    displayList,
    action,
  } = props;
  const [fileList, setFileList] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef();

  const uploadPreparation = (files) => {
    const newFileList = [...fileList];

    for (let i = 0; i < files.length; i++) {
      const fileError = validateFile(files[i]);
      newFileList.push({
        id: uniqId(),
        url: URL.createObjectURL(files[i]),
        name: files[i].name,
        size: files[i].size,
        ext: files[i].name.split(".").at(-1),
        type: files[i].type,
        originaFileObj: files[i],
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
    onChange(newFileList);
  };

  const initUploadMethod = () => fileInputRef.current && fileInputRef.current.click();
  const onUploadInputChange = () => uploadPreparation(fileInputRef.current.files);

  const removeFileHandler = useCallback(
    (fileId) => () => {
      const newFileList = fileList.filter((file) => file.id !== fileId);
      setFileList(newFileList);
      onFileListUpdate(REMOVE_FILE, newFileList);
    },
    [fileList, onFileListUpdate]
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
    [fileList]
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
      <div className="upload-list">
        <UploadContext.Provider value={{ action, displayList, onFileListUpdate }}>
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
};

Upload.defaultProps = {
  onFileListUpdate: () => null,
};

Upload.displayName = "Upload";

export { REMOVE_FILE, ADD_FILE };
export default Upload;
