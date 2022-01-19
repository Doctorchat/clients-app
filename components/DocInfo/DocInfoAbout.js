import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Skeleton from "../Skeleton";
import getActiveLng from "@/utils/getActiveLng";

const selectedLng = getActiveLng();

export default function DocInfoAbout(props) {
  const { about, loading } = props;
  const { t } = useTranslation();

  if (loading) {
    return (
      <Skeleton className="mt-3 overflow-hidden" smooth>
        <Skeleton.Line className="mb-3" w="40%" h="26px" />
        <Skeleton.Line className="mb-2" w="80%" h="20px" />
        <Skeleton.Line className="mb-2" w="65%" h="20px" />
        <Skeleton.Line className="mb-4" w="90%" h="20px" />
        <Skeleton.Line className="mb-3" w="40%" h="26px" />
        <Skeleton.Line className="mb-2" w="65%" h="20px" />
        <Skeleton.Line className="mb-2" w="65%" h="20px" />
        <Skeleton.Line w="80%" h="20px" />
      </Skeleton>
    );
  }

  return (
    <div className="doc-info-tab-content doc-info-activiy">
      <div className="doc-info-section">
        <h4 className="info-section-title">{t("doctor_info.about_me")}</h4>
        <p className="info-section-descrp">{about?.[`bio_${selectedLng}`]}</p>
      </div>
      <div className="doc-info-section">
        <h4 className="info-section-title">{t("general_information")}</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                {t("doctor_info.years_experience")} <b>{about?.experience}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                {t("professional_title")} <b>{about?.professionalTitle}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                {t("specialization")} <b>{about?.[`specialization_${selectedLng}`]}</b>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

DocInfoAbout.propTypes = {
  about: PropTypes.shape({
    bio: PropTypes.string,
    experience: PropTypes.number,
    specialization: PropTypes.string,
    professionalTitle: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

DocInfoAbout.defaultProps = {
  loading: false,
};
