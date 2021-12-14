import Skeleton from "../Skeleton";

export default function ReviewSkeleton() {
  return (
    <div className="review-item">
      <div className="review-avatar">
        <Skeleton.Circle w="58px" h="58px" />
      </div>
      <div className="review-content">
        <div className="review-top">
          <Skeleton.Line className="mb-2" w="40%" h="16px" />
        </div>
        <div className="review-bottom">
          <Skeleton.Line className="mb-1" w="90%" h="12px" />
          <Skeleton.Line w="60%" h="12px" />
        </div>
      </div>
    </div>
  );
}
