import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import PropTypes from "prop-types";

import { calculateAge } from "@/utils/date";
import getSelectLabel from "@/utils/getSelectLabel";

import Image from "../Image";
import Skeleton from "../Skeleton";

export default function ClientInfo(props) {
  const { client, loading, selectedInvestigation } = props;
  const [investigation, setInvestigation] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (client.investigations) {
      const activeInvestigation = client.investigations.find(
        (investigation) => investigation.id === selectedInvestigation
      );

      if (activeInvestigation) {
        setInvestigation(activeInvestigation);
      }
    }
  }, [client.investigations, selectedInvestigation]);

  return (
    <div className="client-info">
      <div className="client-info-top">
        <div className="dialog-avatar">
          <Image w="100" h="100" alt={investigation.name} src={client.avatar} />
        </div>
        <div className="client-info-caption">
          <h4 className="title ellipsis">
            {loading ? (
              <Skeleton>
                <Skeleton.Line w="120px" h="22px" />
              </Skeleton>
            ) : (
              <span className="name ellipsis">{investigation.name}</span>
            )}
          </h4>
        </div>
      </div>

      <div className="client-info-invetigation">
        <div className="confirmation-section client-info-section vertical">
          <table>
            <tbody>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("activity")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="120px" h="18px" />
                    </Skeleton>
                  ) : (
                    investigation.activity
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-section client-info-section">
          <table>
            <tbody>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("age")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="64px" h="18px" />
                    </Skeleton>
                  ) : (
                    <Age birthday={investigation.age} />
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("height_cm")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="64px" h="18px" />
                    </Skeleton>
                  ) : (
                    investigation.height
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("weight_kg")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="64px" h="18px" />
                    </Skeleton>
                  ) : (
                    investigation.weight
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("investigation_form.bmi")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="64px" h="18px" />
                    </Skeleton>
                  ) : (
                    investigation.bmi
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("investigation_form.sex")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="64px" h="18px" />
                    </Skeleton>
                  ) : (
                    getSelectLabel(investigation.sex, [
                      { value: "male", label: "Masculin" },
                      { value: "female", label: "Feminin" },
                    ])
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("investigation_form.location")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="130px" h="18px" />
                    </Skeleton>
                  ) : (
                    investigation.location
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

ClientInfo.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    avatar: PropTypes.string,
    investigations: PropTypes.array,
  }),
  loading: PropTypes.bool,
  selectedInvestigation: PropTypes.number,
};

ClientInfo.defaultProps = {
  doctor: {
    activity: {},
  },
};

const Age = ({ birthday }) => {
  const age = calculateAge(birthday);

  if (!age.years && !age.months && !age.weeks) return "-"; // handle invalid age

  if (age.years > 7) return age.years + " " + t("years"); // handle age over 7 years

  if (age.years < 1) {
    if (age.months && age.weeks) {
      return age.months + " " + t("months") + " " + t("and") + " " + age.weeks + " " + t("weeks");
    } else if (age.months) {
      return age.months + " " + t("months");
    } else if (age.weeks) {
      return age.weeks + " " + t("weeks");
    } else {
      return t("lessThanOneWeek"); // handle age less than 1 week
    }
  }

  if (age.years === 1) {
    const monthsString = age.months ? " " + t("and") + " " + age.months + " " + t("months") : "";
    return age.years + " " + t("year") + monthsString; // handle age 1 year
  }

  if (age.years < 7) {
    const monthsString = age.months ? " " + t("and") + " " + age.months + " " + t("months") : "";
    return age.years + " " + t("years") + monthsString; // handle age between 1 and 7 years
  }

  // handle any other cases
  return (
    "-" +
    " " +
    age.years +
    " " +
    t("years") +
    " " +
    t("and") +
    " " +
    age.months +
    " " +
    t("months") +
    " " +
    t("and") +
    " " +
    age.weeks +
    " " +
    t("weeks")
  );
};
