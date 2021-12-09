import PropTypes from "prop-types";
import HeartIcon from "@/icons/heart.svg";
import LikeIcon from "@/icons/like.svg";
import StarIcon from "@/icons/star.svg";
import ClockIcon from "@/icons/clock.svg";
import HospitalIcon from "@/icons/hospital.svg";
import GraduationIcon from "@/icons/graduation-cap.svg";

export default function DocInfoSummary(props) {
  const { summary } = props;

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
                Am ajutat <b>245</b> oameni
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon like">
                <LikeIcon />
              </span>
              <span className="text">
                Utilizatori mulțumiți <b>97%</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon star">
                <StarIcon />
              </span>
              <span className="text">
                Aprecieri de la utilizaotri <b>24</b>
              </span>
            </div>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon clock">
                <ClockIcon />
              </span>
              <span className="text">
                Timp de răspuns: <b>6-10</b> ore
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
        <h4 className="info-section-title">Locuri de muncă</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon hospital">
                <HospitalIcon />
              </span>
              <span className="text">Medicover Oregon Park</span>
            </div>
            <span className="descrp">Șoseaua Pipera nr 46D-46E-48, corp B</span>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon hospital">
                <HospitalIcon />
              </span>
              <span className="text">Enayati Medical City</span>
            </div>
            <span className="descrp">Sos Gh. Ionescu Sisesti nr 8A</span>
          </li>
        </ul>
      </div>
      <div className="doc-info-section">
        <h4 className="info-section-title">Educație</h4>
        <ul className="doc-info-list">
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon hospital">
                <GraduationIcon />
              </span>
              <span className="text">Medicover Oregon Park</span>
            </div>
            <span className="descrp">Șoseaua Pipera nr 46D-46E-48, corp B</span>
          </li>
          <li className="doc-info-list-item">
            <div className="content">
              <span className="icon hospital">
                <GraduationIcon />
              </span>
              <span className="text">Enayati Medical City</span>
            </div>
            <span className="descrp">Sos Gh. Ionescu Sisesti nr 8A</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

DocInfoSummary.propTypes = {};

DocInfoSummary.defaultProps = {};
