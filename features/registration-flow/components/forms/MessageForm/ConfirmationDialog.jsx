import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Popup from "@/components/Popup";
import asPrice from "@/utils/asPrice";

export const ConfirmationDialog = ({ data }) => {
  const { t } = useTranslation();

  const { value: isPopupVisible, setFalse: onClosePopup } = useBoolean(true);
  const { value: areTermsAccepted, toggle: onChangeAreTermsccepted } = useBoolean(false);

  return (
    <Popup
      className="registration-flow__modal message-confirmation__modal"
      visible={isPopupVisible}
    >
      <Popup.Header title={<BackTitle title={t("confirmation")} onBack={onClosePopup} />} />
      <div className="message-confirmation__content">
        <div className="confirmation-section">
          <table>
            <tbody>
              <tr className="dc-description-title">
                <th colSpan="2">{t("message_form_confirmation.symmary")}</th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.description")}
                </th>
                <td className="dc-description-row-content">{data.content}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("terms_conditions")}</th>
                <td className="dc-description-row-content">
                  <a
                    href="https://doctorchat.md/termeni-si-conditii/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t("terms_conditions")}
                  </a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.basic_price")}
                </th>
                <td className="dc-description-row-content">{`${asPrice(+data.price.base)}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{`${t(
                  "message_form_confirmation.files"
                )}(${data.uploads_count})`}</th>
                <td className="dc-description-row-content">{`+${asPrice(+data.price.uploads)}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.subtotal_price")}
                </th>
                <td className="dc-description-row-content">{`${asPrice(
                  +data.price.uploads + +data.price.base
                )}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-section">
          <table>
            <tbody>
              <tr className="dc-description-title">
                <th colSpan="2">
                  <div className="dc-description-title-trunc">
                    <span>{t("message_form_confirmation.payment_security")}</span>
                    <a href="https://mobilpay.com/" target="_blank" rel="noreferrer">
                      MobilPay
                    </a>
                  </div>
                </th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.company")}
                </th>
                <td className="dc-description-row-content">WEBMEDCONSULT SRL</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.product")}
                </th>
                <td className="dc-description-row-content">Doctorchat</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.adress")}
                </th>
                <td className="dc-description-row-content">
                  Bucureşti, sector 6, Splaiul Independenţei nr. 273, corp 3, etaj 3
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("email")}</th>
                <td className="dc-description-row-content">
                  <a href="mailto:info@doctorchat.md">info@doctorchat.md</a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("phone")}</th>
                <td className="dc-description-row-content">
                  <a href="tel:+373 78 272 887">+373 78 272 887</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="confirmation-terms mb-4">
          <Checkbox
            value={areTermsAccepted}
            onChange={() => onChangeAreTermsccepted(!areTermsAccepted)}
            label={
              <>
                {t("accept_terms")}{" "}
                <a
                  href="https://doctorchat.md/termeni-si-conditii/"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="terms"
                >
                  {t("terms_conditions")}
                </a>
              </>
            }
          />
        </div>
        <div className="confirmation-actions">
          <Button type="outline" onClick={onClosePopup}>
            {t("back")}
          </Button>
          <Button disabled={!areTermsAccepted}>{t("message_form_confirmation.confirm")}</Button>
        </div>
      </div>
    </Popup>
  );
};

ConfirmationDialog.propTypes = {
  data: PropTypes.object,
};
