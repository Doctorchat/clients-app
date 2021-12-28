export default function TransactionItemSkeleton() {
  return (
    <div className="transaction-item skeleton">
      <div className="transaction-category" />
      <div className="transaction-caption">
        <h4 className="transaction-title">
          <span className="category-title" />
          <span className="transaction-sum" />
        </h4>
        <p className="transaction-subtitle" />
      </div>
    </div>
  );
}
