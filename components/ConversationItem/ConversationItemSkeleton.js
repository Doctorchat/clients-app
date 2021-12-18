export default function ConversationItemSkeleton() {
  return (
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
}
