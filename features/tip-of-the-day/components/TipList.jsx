import { useTranslation } from "react-i18next";
import Image from "@/components/Image";
import Spinner, { Bar } from "@/components/Spinner";
import Button from "@/components/Button";
import { formatDateWithYearOption } from "@/utils/formatDate";

export default function TipList({ tips, loading, onSelectTip, onLoadMore, hasMore }) {
  const { t } = useTranslation();

  if (loading && tips.length === 0) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
        <div className="tw-text-center">
          <Bar />
          <p className="tw-mt-3 tw-text-emerald-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tip-list tw-p-2 md:tw-p-4">
      {tips.map((tip) => (
        <div 
          key={tip.id} 
          className="tw-bg-white tw-border tw-border-gray-100 tw-rounded-xl tw-shadow-sm tw-mb-5 tw-overflow-hidden tw-cursor-pointer hover:tw-shadow-md hover:tw-border-emerald-200 tw-transition-all"
          onClick={() => onSelectTip(tip.id)}
        >
          {tip.image && (
            <div className="tw-overflow-hidden tw-flex tw-justify-center tw-items-center tw-p-3 md:tw-p-0">
              <img
                src={tip.image}
                alt={tip.title}
                className="tw-max-w-full tw-rounded-lg"
                style={{ maxHeight: '180px', objectFit: 'contain', width: '100%' }}
              />
            </div>
          )}
          <div className="tw-p-3 md:tw-p-5">
            <h3 className="tw-font-bold tw-text-lg tw-text-gray-800 tw-mb-3 tw-leading-tight">
              {tip.title}
            </h3>
            
            <div className="tw-flex tw-justify-between tw-items-center tw-text-sm tw-mt-4 tw-pt-3 tw-border-t">
              <div className="tw-flex tw-items-center tw-gap-2">
                {tip.created_by && (
                  <>
                    <Image
                      src={tip.created_by.avatar}
                      alt={tip.created_by.name}
                      className="tw-w-8 tw-h-8 tw-rounded-full tw-border tw-border-emerald-100"
                    />
                    <span className="tw-font-medium tw-text-gray-700">{tip.created_by.name}</span>
                  </>
                )}
              </div>
              <span className="tw-text-emerald-600">{formatDateWithYearOption(tip.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div className="tw-flex tw-justify-center tw-mb-8 tw-mt-4">
          <Button 
            onClick={onLoadMore} 
            disabled={loading}
            className="tw-bg-emerald-600 hover:tw-bg-emerald-700 tw-min-w-[140px]"
            type="primary"
          >
            {loading ? <Spinner /> : t("load_more")}
          </Button>
        </div>
      )}
      
      {tips.length === 0 && !loading && (
        <div className="tw-text-center tw-py-10 tw-text-gray-500">
          {t("no_data")}
        </div>
      )}
    </div>
  );
}