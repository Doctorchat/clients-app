export default function DocItemSkeleton() {
  return (
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
}
