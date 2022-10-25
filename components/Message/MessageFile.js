import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import FileIcon from "@/icons/file.svg";
import cs from "@/utils/classNames";
import formatBytes from "@/utils/formatBytes";

import Image from "../Image";

export default function MessageFile(props) {
  const { file, side } = props;

  const [extraConfig, setExtraConfig] = useState({ type: null, extension: null });

  useEffect(() => {
    if (file) {
      setExtraConfig({
        type: file.type.startsWith("image") ? "image" : "document",
        extension: file.name.split(".").pop(),
      });
    }
  }, [file]);

  return (
    <div className={cs("message-file upload-file", side)}>
      <div className="upload-file-main">
        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
          {extraConfig.type === "image" ? (
            <div className="upload-file-preview">
              <FileIcon />
              <Image alt={file.name} src={file.file_url} w="50" h="50" />
            </div>
          ) : (
            <div className="upload-file-preview document">
              <FileIcon />
            </div>
          )}
        </a>
        <div className="upload-file-meta">
          <a href={file.file_url} target="_blank" rel="noopener noreferrer">
            <h5 className="file-name">
              <span className="ellipsis">{file.name}</span>
            </h5>
          </a>
          <div className="file-caption">
            <div className="file-caption-info">
              <span className="ext">{extraConfig.extension}</span>
              <span className="size">{formatBytes(file.size)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MessageFile.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    file_url: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
  }),
  side: PropTypes.string,
};

MessageFile.defaultProps = {};
