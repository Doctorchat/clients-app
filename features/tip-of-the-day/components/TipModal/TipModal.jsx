import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "@/components/Image";
import Button from "@/components/Button";
import { Bar } from "@/components/Spinner";
import TimesIcon from "@/icons/times.svg";
import { formatDateWithYearOption } from "@/utils/formatDate";
import tipApi from "../../api";

export default function TipModal({ visible, onClose, tipId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const fetchTipDetail = useCallback(async (id) => {
    if (!visible || !id) return;

    try {
      setLoading(true);
      const response = await tipApi.getTipById(id);
      setTip(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tip detail", error);
    } finally {
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && tipId) {
      fetchTipDetail(tipId);
      setShowFullContent(false);
    }
  }, [fetchTipDetail, tipId, visible]);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  if (!visible) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-px-4">
        <div 
          className="tw-bg-white tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-2xl tw-overflow-hidden tw-flex tw-flex-col tw-animate-fadeIn tw-m-auto"
          style={{ 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="tw-p-5 tw-flex tw-justify-between tw-items-center tw-bg-emerald-600 tw-text-white">
            <h2 className="tw-text-xl tw-font-bold">{t("tip_of_the_day")}</h2>
            <button 
              onClick={onClose}
              className="tw-p-2 tw-rounded-full hover:tw-bg-emerald-500 tw-text-white tw-transition-colors"
            >
              <TimesIcon width={20} height={20} />
            </button>
          </div>
          <div className="tw-p-12 tw-flex tw-items-center tw-justify-center">
            <div className="tw-text-center">
              <Bar />
              <p className="tw-mt-4 tw-text-emerald-600">{t("loading")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="fixed inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-px-4">
        <div 
          className="tw-bg-white tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-2xl tw-overflow-hidden tw-flex tw-flex-col tw-animate-fadeIn tw-m-auto"
          style={{ 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="tw-p-5 tw-flex tw-justify-between tw-items-center tw-bg-emerald-600 tw-text-white">
            <h2 className="tw-text-xl tw-font-bold">{t("tip_of_the_day")}</h2>
            <button 
              onClick={onClose}
              className="tw-p-2 tw-rounded-full hover:tw-bg-emerald-500 tw-text-white tw-transition-colors"
            >
              <TimesIcon width={20} height={20} />
            </button>
          </div>
          <div className="tw-p-12 tw-text-center tw-text-gray-500">
            {t("no_data")}
          </div>
          <div className="tw-p-4 tw-border-t tw-flex tw-justify-center tw-items-center tw-bg-gray-50">
            <Button
              type="primary"
              onClick={onClose}
              className="tw-bg-emerald-600 hover:tw-bg-emerald-700 tw-px-6"
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-px-4">
      <div 
        className="tw-bg-white tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-2xl tw-max-h-[85vh] tw-overflow-hidden tw-flex tw-flex-col tw-animate-fadeIn tw-m-auto"
        style={{ 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(0)',
          opacity: 1,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Header with emerald green background */}
        <div className="tw-p-5 tw-flex tw-justify-between tw-items-center tw-bg-emerald-600 tw-text-white">
          <h2 className="tw-text-xl tw-font-bold tw-truncate">
            {tip?.title || t("tip_of_the_day")}
          </h2>
          <button 
            onClick={onClose} 
            className="tw-p-2 tw-rounded-full hover:tw-bg-emerald-500 tw-text-white tw-transition-colors"
            aria-label="Close"
          >
            <TimesIcon width={20} height={20} />
          </button>
        </div>

        <div className="tw-overflow-y-auto tw-flex-1">
          <div className="tip-detail">
            {tip.image && (
              <div style={{ padding: '8px', display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                <img
                  src={`${tip.image}?v=1.2`} /* Cache buster */
                  alt={tip.title}
                  style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }}
                />
              </div>
            )}
            
            <div className="tw-p-3 md:tw-p-6">
              {/* Author info card with subtle background */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {tip.created_by && (
                  <>
                    <Image
                      src={`${tip.created_by.avatar}?v=1.2`} /* Cache buster */
                      alt={tip.created_by.name}
                      className="tw-w-10 tw-h-10 md:tw-w-14 md:tw-h-14 tw-rounded-full tw-border-2 tw-border-emerald-100"
                    />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tip.created_by.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#059669' }}>{formatDateWithYearOption(tip.created_at)}</div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Content with improved typography */}
              <div className="tw-prose tw-max-w-none tw-prose-emerald tw-prose-headings:text-emerald-800">
                {showFullContent ? (
                  <div 
                    className="tw-text-gray-700" 
                    dangerouslySetInnerHTML={{ __html: tip.content }}
                  />
                ) : (
                  <>
                    <div 
                      className="tw-line-clamp-5 tw-text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: tip.content 
                          ? tip.content.split('<p>').slice(0, 2).join('<p>')
                          : ''
                      }} 
                    />
                    <Button 
                      type="text"
                      onClick={toggleContent}
                      className="tw-mt-4 tw-text-emerald-600 hover:tw-text-emerald-700 tw-font-medium"
                    >
                      {t("read_more")} →
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with centered close button */}
        <div className="tw-p-4 tw-border-t tw-flex tw-justify-center tw-items-center tw-bg-gray-50">
          <Button
            type="primary"
            onClick={onClose}
            className="tw-bg-emerald-600 hover:tw-bg-emerald-700 tw-px-6"
          >
            {t("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}