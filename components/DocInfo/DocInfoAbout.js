import PropTypes from "prop-types";
import Skeleton from "../Skeleton";

export default function DocInfoAbout(props) {
  const { about, loading } = props;

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
        <h4 className="info-section-title">Informație generală</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                Ani experiență <b>{about?.experience}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                Titlu Profesional <b>{about?.professionalTitle}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="text">
                Specializare <b>{about?.specialization}</b>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div className="doc-info-section">
        <h4 className="info-section-title">Despre Mine</h4>
        <p className="info-section-descrp">{about?.bio}</p>
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
