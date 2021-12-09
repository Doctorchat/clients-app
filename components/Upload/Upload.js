import PropTypes from "prop-types";
import { forwardRef, useCallback, useRef, useState } from "react";
import UploadItem from "./UploadItem";
import uniqId from "@/utils/uniqId";
import cs from "@/utils/classNames";
import validateFile from "@/utils/validateFile";

const REMOVE_FILE = Symbol("remove_file");
const ADD_FILE = Symbol("add_file");

const Upload = forwardRef((props, ref) => {
  const { name, description, label, icon, accept, onChange, onFileListUpdate, fileItemClassName } =
    props;
  const [fileList, setFileList] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef();

  const uploadHandler = (files) => {
    const newFileList = [...fileList];

    for (let i = 0; i < files.length; i++) {
      const fileError = validateFile(files[i]);

      newFileList.push({
        fileId: uniqId(),
        fileURL: URL.createObjectURL(files[i]),
        fileName: files[i].name,
        fileSize: files[i].size,
        fileExt: files[i].name.split(".").at(-1),
        fileType: files[i].type,
        originaFileObj: files[i],
        fileIsUploaded: false,
        fileError,
      });
    }

    fileInputRef.current.value = ""; // Clear input
    setFileList(newFileList);
    onChange(newFileList);
    onFileListUpdate(ADD_FILE, newFileList);
  };

  const initUploadMethod = () => fileInputRef.current && fileInputRef.current.click();
  const onUploadInputChange = () => uploadHandler(fileInputRef.current.files);

  const removeFileHandler = useCallback(
    (fileId) => () => {
      const newFileList = fileList.filter((file) => file.fileId !== fileId);
      setFileList(newFileList);
      onFileListUpdate(REMOVE_FILE, newFileList);
    },
    [fileList, onFileListUpdate]
  );

  const updateFileHandler = useCallback(
    (fileId) => (data) => {
      const newFileList = [...fileList];

      for (let i = 0; i < newFileList.length; i++) {
        if (fileId === newFileList[i].fileId) {
          newFileList[i] = { ...newFileList[i], ...data };
        }
      }

      setFileList(newFileList);
    },
    [fileList]
  );

  // Drag & Drop
  function dragleave(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);
  }

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(true);
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);

    const dt = e.dataTransfer;
    const files = dt.files;

    uploadHandler(files);
  }

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
        {fileList.map((file) => (
          <UploadItem
            key={file.fileId}
            className={fileItemClassName}
            file={file}
            removeFile={removeFileHandler(file.fileId)}
            updateFile={updateFileHandler(file.fileId)}
          />
        ))}
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
};

Upload.defaultProps = {
  onFileListUpdate: () => null,
};

Upload.displayName = "Upload";

export { REMOVE_FILE, ADD_FILE };
export default Upload;
