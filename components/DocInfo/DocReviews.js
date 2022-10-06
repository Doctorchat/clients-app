import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { getDocReviews } from "@/store/actions";

import List from "../List";
import ReviewsList, { ReviewItemSkeleton } from "../ReviewsList";

export default function DocReviews(props) {
  const { docId, reviewsAction } = props;
  const { docReviews } = useSelector((store) => ({ docReviews: store.docReviews }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (docId) {
      dispatch(getDocReviews({ id: docId, action: reviewsAction }));
    }
  }, [dispatch, docId, reviewsAction]);

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
          content: t("reviews_list_empty"),
        }}
      >
        <ReviewsList data={docReviews.data?.list} />
      </List>
    </div>
  );
}

DocReviews.propTypes = {
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reviewsAction: PropTypes.func,
};
