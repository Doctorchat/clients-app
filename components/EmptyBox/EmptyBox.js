import PropTypes from "prop-types";
import Image from "../Image/Image";
import emptyIcon from "@/imgs/empty-folder.png";
import cs from "@/utils/classNames";

export default function EmptyBox(props) {
  const { className, title, content } = props;

  return (
    <div className={cs("empty-box", className)}>
      <div className="empty-box-image">
        <Image alt="Nu-s date" w="64" h="64" src={emptyIcon.src} />
      </div>
      <div className="empty-box-content">
        <h4 className="empty-box-title">{title}</h4>
        <p className="empty-box-descrp">{content}</p>
      </div>
    </div>
  );
}

EmptyBox.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
};

EmptyBox.defaultProps = {
  title: "Nu-s date",
  content: "Aici va apărea lista de converații",
};
