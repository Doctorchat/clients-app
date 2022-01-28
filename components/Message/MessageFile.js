import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Image from "../Image";
import formatBytes from "@/utils/formatBytes";
import documnetPlaceholder from "@/imgs/doc.png";
import cs from "@/utils/classNames";

export default function MessageFile(props) {
  const { file, side } = props;
  const [extraConfig, setExtraConfig] = useState({ placeholder: null, ext: null });

  useEffect(() => {
    let file_ext = file.name.split(".");

    file_ext = file_ext[file_ext.length - 1];

    const placeholder = !file.type.match(/image/g) && documnetPlaceholder.src;

    setExtraConfig({ ext: file_ext, placeholder });
  }, [file]);

  return (
    <div className={cs("message-file upload-file", side)}>
      <div className="upload-file-main">
        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
          <div className="upload-file-preview">
            <Image alt={file.name} src={extraConfig.placeholder || file.file_url} w="50" h="50" />
          </div>
        </a>
        <div className="upload-file-meta">
          <a href={file.file_url} target="_blank" rel="noopener noreferrer">
            <h5 className="file-name">
              <span className="ellipsis">{file.name}</span>
            </h5>
          </a>
          <div className="file-caption">
            <div className="file-caption-info">
              <span className="ext">{extraConfig.ext}</span>
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
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  side: PropTypes.string,
};

MessageFile.defaultProps = {};
