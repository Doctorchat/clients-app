import Image from "@/components/Image";
import { Bar } from "@/components/Spinner";
import Button from "@/components/Button";
import { formatDateWithYearOption } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import ChatIcon from "@/icons/chat.svg";

export default function TipDetail({ tip, loading }) {
  const { t } = useTranslation();
  const router = useRouter();

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
        <div className="tw-text-center">
          <Bar />
          <p className="tw-mt-3 tw-text-emerald-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!tip) return null;

  const hasDoctor = tip.created_by && tip.created_by.id;
  
  const handleConsultClick = (e) => {
    e.preventDefault();
    console.log("CTA clicked, doctor_id:", tip.created_by.id);
    // Force navigation with window.location
    if (hasDoctor) {
      const url = `/registration-flow/select-doctor?doctor_id=${tip.created_by.id}`;
      console.log("Navigating to:", url);
      setTimeout(() => {
        window.location.href = url;
      }, 100);
    }
  };

  return (
    <div className="tip-detail tw-p-3 md:tw-p-4">
      {tip.image && (
        <div className="tip-image-container">
          <img
            src={`${tip.image}?v=1.1`} /* Cache buster */
            alt={tip.title}
          />
        </div>
      )}
      
      {hasDoctor && (
        <div className="tip-author-card">
          <Image
            src={`${tip.created_by.avatar}?v=1.1`} /* Cache buster */
            alt={tip.created_by.name}
            className="avatar"
          />
          <div className="info">
            <div className="name">{tip.created_by.name}</div>
            <div className="date">{formatDateWithYearOption(tip.created_at)}</div>
          </div>
        </div>
      )}
      
      <div className="tw-prose tw-max-w-none tw-prose-emerald tw-prose-headings:text-emerald-800">
        <div 
          className="tw-text-gray-700" 
          dangerouslySetInnerHTML={{ __html: tip.content }}
        />
      </div>
      
      {hasDoctor && (
        <div className="tw-mt-14 tw-mb-6 tw-flex tw-justify-center">
          <a
            href={`/registration-flow/select-doctor?doctor_id=${tip.created_by.id}`}
            className="tw-shadow-lg tw-rounded-xl tw-overflow-hidden tw-no-underline tw-inline-block btn-consult-pulse hover:tw-shadow-emerald-200/50"
          >
            <div className="tw-bg-gradient-to-r tw-from-emerald-600 tw-to-emerald-500 tw-px-10 tw-py-4 tw-text-lg tw-font-medium tw-text-white tw-flex tw-items-center">
              <div className="tw-bg-white/20 tw-rounded-full tw-p-1.5 tw-mr-3">
                <ChatIcon className="tw-fill-white" width={22} height={22} />
              </div>
              {t("consult_with_doctor")}
            </div>
          </a>
        </div>
      )}
    </div>
  );
}