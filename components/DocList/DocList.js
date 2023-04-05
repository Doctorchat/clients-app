import { memo } from "react";
import PropTypes from "prop-types";

import DocItem from "../DocItem";

function DocList(props) {
  const { data, onDocClick } = props;

  const DocListData = [...data].map((doc) => <DocItem key={doc.id} data={doc} onClick={onDocClick(doc)} />);

  return <ul className="doclist">{DocListData}</ul>;
}

DocList.propTypes = {
  data: PropTypes.array,
  onDocClick: PropTypes.func,
};

DocList.defaultProps = {
  data: [],
};

export default memo(DocList);
