import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import ChatListError from "../ChatListError";
import ListLoading from "../ListLoading";
import DocItem from "../DocItem";
import cs from "@/utils/classNames";

const SECTIONS = {
  LOADING: "loading",
  LIST: "list",
  ERROR: "error",
};

function DocList(props) {
  const { listSlice, onDocClick } = props;
  const [activeSection, setActiveSection] = useState(SECTIONS.LOADING);

  const DocListData = [...listSlice.data]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .map((doc) => <DocItem key={doc.id} data={doc} onClick={onDocClick(doc)} />);

  useEffect(() => {
    if (listSlice.isError && !listSlice.isLoading) {
      setActiveSection(SECTIONS.ERROR);
    } else if (listSlice.isLoading) {
      setActiveSection(SECTIONS.LOADING);
    } else {
      setActiveSection(SECTIONS.LIST);
    }
  }, [listSlice]);

  return (
    <ul className={cs("doclist", listSlice.isError && "error")}>
      {activeSection === SECTIONS.ERROR && <ChatListError />}
      {activeSection === SECTIONS.LOADING && <ListLoading skeletonName="docItem" />}
      {activeSection === SECTIONS.LIST && DocListData}
    </ul>
  );
}

DocList.propTypes = {
  listSlice: PropTypes.shape({
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    data: PropTypes.array,
  }),
  onDocClick: PropTypes.func,
};

DocList.defaultProps = {
  listSlice: {
    data: [],
  },
};

export default memo(DocList);
