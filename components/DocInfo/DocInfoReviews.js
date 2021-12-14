import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsList, { ReviewItemSkeleton } from "../ReviewsList";
import List from "../List";
import { getDocReviews } from "@/store/actions";

export default function DocInfoReviews(props) {
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
        loading={docReviews.isLoading}
        error={docReviews.isError}
        empty={!docReviews.data?.list?.length}
        loadingClassName="reviews-list"
        skeleton={ReviewItemSkeleton}
        emptyDescription="Aici va apărea lista de recenzii"
        emptyClassName="pt-4"
      >
        <ReviewsList data={docReviews.data?.list} />
      </List>
    </div>
  );
}

DocInfoReviews.propTypes = {
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DocInfoReviews.defaultProps = {};
