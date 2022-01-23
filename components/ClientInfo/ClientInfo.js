import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "../Image";
import Skeleton from "../Skeleton";
import {
  allergiesOptions,
  diseasesOptions,
  epidemiologicalOptions,
} from "@/context/staticSelectOpts";
import getSelectLabel from "@/utils/getSelectLabel";

export default function ClientInfo(props) {
  const { client, loading, selectedInvestigation } = props;
  const [investigation, setInvetigation] = useState({});
  const { t } = useTranslation();


  useEffect(() => {
    if (client.investigations) {
      const activeInvetigation = client.investigations.find(
        (investigation) => investigation.id === selectedInvestigation
      );

      if (activeInvetigation) {
        setInvetigation(activeInvetigation);
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
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("epidemiological")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="45%" h="18px" />
                    </Skeleton>
                  ) : (
                    getSelectLabel(investigation.epidemiological, epidemiologicalOptions)
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("diseases")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line w="45%" h="16px" />
                    </Skeleton>
                  ) : (
                    <p className="mb-1 bolder-p">
                      {getSelectLabel(investigation.diseases, diseasesOptions)}
                    </p>
                  )}
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line className="mb-1" w="45%" h="12px" />
                      <Skeleton.Line className="mb-1" w="65%" h="12px" />
                      <Skeleton.Line w="35%" h="12px" />
                    </Skeleton>
                  ) : (
                    <p className="mb-0">{investigation.diseases_spec}</p>
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("allergies")}</th>
                <td className="dc-description-row-content">
                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line className="mb-1" w="45%" h="16px" />
                    </Skeleton>
                  ) : (
                    <p className="mb-1 bolder-p">
                      {getSelectLabel(investigation.allergies, allergiesOptions)}
                    </p>
                  )}

                  {loading ? (
                    <Skeleton>
                      <Skeleton.Line className="mb-1" w="45%" h="12px" />
                      <Skeleton.Line className="mb-1" w="65%" h="12px" />
                      <Skeleton.Line w="35%" h="12px" />
                    </Skeleton>
                  ) : (
                    <p className="mb-0">{investigation.allergies_spec}</p>
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
                    investigation.age
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
