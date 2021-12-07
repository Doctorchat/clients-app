import PropTypes from "prop-types";
import { memo } from "react";

const DocItemSekeleton = () => (
  <li className="doc-item skeleton" role="button">
    <div className="doc-item-info">
      <div className="dialog-avatar" />
      <div className="doc-caption">
        <h4 className="doc-title" />
        <p className="doc-category" />
        <div className="doc-item-meta">
          <div className="doc-meta-item" />
          <div className="doc-meta-item" />
        </div>
      </div>
    </div>
  </li>
);

const ChatItemSkeleton = () => (
  <li className="dialog-item skeleton">
    <div className="dialog-avatar" />
    <div className="user-caption">
      <h4 className="dialog-title">
        <span className="user-title" />
      </h4>
      <p className="dialog-subtitle" />
    </div>
  </li>
);

const skeletonsList = {
  chatItem: ChatItemSkeleton,
  docItem: DocItemSekeleton,
};

const ListLoading = ({ skeletonName, itemsCount }) => {
  const SkeletonComponent = skeletonsList[skeletonName];

  return Array.from(Array(itemsCount)).map((_, i) => <SkeletonComponent key={`${i}-sklt`} />);
};

ListLoading.propTypes = {
  skeletonName: PropTypes.oneOf(["chatItem", "docItem"]),
  itemsCount: PropTypes.number,
};

ListLoading.defaultProps = {
  itemsCount: 3,
};

export default memo(ListLoading);
