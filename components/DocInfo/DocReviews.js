import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsList, { ReviewItemSkeleton } from "../ReviewsList";
import List from "../List";
import { getDocReviews } from "@/store/actions";

export default function DocReviews(props) {
  const { docId } = props;
  const { docReviews } = useSelector((store) => ({ docReviews: store.docReviews }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (docId) {
      dispatch(getDocReviews(docId));
    }
  }, [dispatch, docId]);

  return (
    <div className="doc-info-tab-content doc-info-reviews">
      <List
        loadingConfig={{
          status: docReviews.isLoading,
          className: "reviews-list",
          skeleton: ReviewItemSkeleton,
        }}
        errorConfig={{ status: docReviews.isError }}
        emptyConfig={{
          status: !docReviews.data?.list?.length,
          className: "pt-4",
          content: "Aici va apărea lista de recenzii",
        }}
      >
        <ReviewsList data={docReviews.data?.list} />
      </List>
    </div>
  );
}

DocReviews.propTypes = {
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
