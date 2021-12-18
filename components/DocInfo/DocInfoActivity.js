import PropTypes from "prop-types";
import Skeleton from "../Skeleton";
import HeartIcon from "@/icons/heart.svg";
import LikeIcon from "@/icons/like.svg";
import StarIcon from "@/icons/star.svg";
import ClockIcon from "@/icons/clock.svg";
import HospitalIcon from "@/icons/hospital.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";

export default function DocInfoActivity(props) {
  const { activity, loading } = props;

  if (loading) {
    return (
      <Skeleton className="mt-3 overflow-hidden" smooth>
        <Skeleton.Line className="mb-3" w="40%" h="26px" />
        <Skeleton.Line className="mb-2" w="80%" h="20px" />
        <Skeleton.Line className="mb-2" w="65%" h="20px" />
        <Skeleton.Line className="mb-2" w="90%" h="20px" />
        <Skeleton.Line className="mb-4" w="70%" h="20px" />
        <Skeleton.Line className="mb-3" w="43%" h="26px" />
        <Skeleton.Line className="mb-2" w="70%" h="20px" />
        <Skeleton.Line className="mb-2" w="40%" h="20px" />
        <Skeleton.Line className="mb-2" w="55%" h="20px" />
        <Skeleton.Line className="mb-4" w="70%" h="20px" />
        <Skeleton.Line className="mb-3" w="40%" h="26px" />
        <Skeleton.Line className="mb-2" w="67%" h="20px" />
        <Skeleton.Line className="mb-2" w="95%" h="20px" />
        <Skeleton.Line w="80%" h="20px" />
      </Skeleton>
    );
  }

  return (
    <div className="doc-info-tab-content doc-info-activiy">
      <div className="doc-info-section">
        <h4 className="info-section-title">Activitate</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon heart">
                <HeartIcon />
              </span>
              <span className="text">
                Am ajutat <b>{activity?.helpedUsers || "—"}</b> oameni
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon like">
                <LikeIcon />
              </span>
              <span className="text">
                Utilizatori mulțumiți <b>{activity?.likes?.like || "—"}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon star">
                <StarIcon />
              </span>
              <span className="text">
                Recenzii de la utilizaotri <b>{activity?.testimonialsCount || "—"}</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon clock">
                <ClockIcon />
              </span>
              <span className="text">
                Timp de răspuns: <b>{activity?.responseTime || "—"}</b>
              </span>
            </div>
            <span className="descrp">
              Acest timp este estimat folosind cele mai recente răspunsuri. Ocazional poate fi mai
              mare sau mai mic decât intervalul afișat.
            </span>
          </li>
        </ul>
      </div>
      <div className="doc-info-section">
        <h4 className="info-section-title">Loc de muncă</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon hospital">
                <HospitalIcon />
              </span>
              <span className="text">{activity?.workplace}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="doc-info-section">
        <h4 className="info-section-title">Educație</h4>
        <ul className="doc-info-list">
          {activity?.education &&
            activity?.education.map((edc) => (
              <li key={edc} className="doc-info-list-item">
                <div className="content">
                  <span className="icon hospital">
                    <GraduationIcon />
                  </span>
                  <span className="text">{edc}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

DocInfoActivity.propTypes = {
  activity: PropTypes.shape({
    testimonialsCount: PropTypes.number,
    helpedUsers: PropTypes.number,
    responseTime: PropTypes.string,
    likes: PropTypes.number,
    education: PropTypes.array,
    workplace: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

DocInfoActivity.defaultProps = {
  loading: false,
};
