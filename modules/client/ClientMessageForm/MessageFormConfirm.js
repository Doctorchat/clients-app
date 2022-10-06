import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import { PopupContent, PopupHeader } from "@/components/Popup";
import { MESSAGE_TYPES } from "@/context/constants";
import { messageFormTabs } from "@/context/TabsKeys";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { messageFormReset, messageFormToggleVisibility } from "@/store/slices/messageFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import { asPrice } from "@/utils/asPrice";

const promoInputReplacer = (value) => {
  if (value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  return value;
};

function MessageFormConfirmation() {
  const { updateTabsConfig } = useTabsContext();
  const {
    messageForm: { values, chatId, uploads },
  } = useSelector((store) => ({ messageForm: store.messageForm }));
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [price, setPrice] = useState({ doc: 0, uploads: 0, subtotal: 0, total: 0, discount: 0 });
  const [promo, setPromo] = useState({ code: "", sum: 0 });
  const [areTermsConfirmed, setAreTermsConfirmed] = useState(false);
  const { t } = useTranslation();
  const form = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    setPrice({
      doc: values.price,
      uploads: values.uploads_price,
      subtotal: values.price + values.uploads_price,
      total: values.price + values.uploads_price,
    });
  }, [values.price, values.uploads_price]);

  const onPromocodeApplied = useCallback(
    async ({ code }) => {
      try {
        setPromoLoading(true);
        const response = await api.conversation.promo(code);

        const discount = response.data / 100;
        const discoutedPrice = price.total - price.total * discount;

        setPrice((prev) => ({ ...prev, total: discoutedPrice }));
        setPromo({ code, sum: parseFloat(price.subtotal - discoutedPrice).toFixed(2) });
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: "invalid_promo" }));
      } finally {
        setPromoLoading(false);
        form.reset();
      }
    },
    [dispatch, form, price.subtotal, price.total]
  );

  const onConfirmHandler = useCallback(async () => {
    try {
      setLoading(true);

      const payload = { ...values };

      payload.chat_id = chatId;
      payload.type = MESSAGE_TYPES.standard;
      payload.code = promo.code;
      payload.uploads = uploads.list?.map(({ file_id }) => file_id) || [];

      const response = await api.conversation.addMessage(payload);
      const updatedChatItem = {
        id: +response.data.chat_id,
        description: response.data.description,
        status: response.data.status,
        updated: response.data.updated,
      };

      dispatch(updateConversation(updatedChatItem));

      if (response.data.redirect) {
        window.location.replace(response.data.redirect);
      } else {
        dispatch(messageFormToggleVisibility(false));
        dispatch(messageFormReset());
      }
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: "default_error_message" }));
    } finally {
      setLoading(false);
    }
  }, [values, chatId, promo.code, uploads, dispatch]);

  return (
    <div className="popup-body message-from-confirm">
      <PopupHeader
        title={
          <BackTitle
            title={t("confirmation")}
            onBack={updateTabsConfig(messageFormTabs.main, "prev")}
          />
        }
      />
      <PopupContent>
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
                <td className="dc-description-row-content">{values.content}</td>
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
                <td className="dc-description-row-content">{`${asPrice(+price.doc)} Lei`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{`${t(
                  "message_form_confirmation.files"
                )}(${values.uploads_count})`}</th>
                <td className="dc-description-row-content">{`+${asPrice(+price.uploads)} Lei`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.subtotal_price")}
                </th>
                <td className="dc-description-row-content">{`${asPrice(+price.subtotal)} Lei`}</td>
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
                  <a href="mailto:clienti@doctorchat.md">clienti@doctorchat.md</a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("phone")}</th>
                <td className="dc-description-row-content">
                  <a href="tel:+40 (0) 757316087">+40 (0) 757316087</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-section">
          <table>
            <tbody>
              <tr className="dc-description-title">
                <th colSpan="2">{t("message_form_confirmation.have_promo")}</th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.code")}</th>
                <td className="dc-description-row-content promo-code-row">
                  {promo.code ? (
                    <>
                      <span className="d-block">
                        {t("message_form_confirmation.code")}:{" "}
                        <mark className="dc-mark">{promo.code}</mark>
                      </span>
                      <span>
                        {t("message_form_confirmation.discount")}:{" "}
                        <mark className="dc-mark">{promo.sum} Lei</mark>
                      </span>
                    </>
                  ) : (
                    <Form methods={form} onFinish={onPromocodeApplied} className="promo-code-form">
                      <Form.Item name="code">
                        <Input
                          pattern={promoInputReplacer}
                          autoComplete="off"
                          placeholder="WINTER20"
                          size="sm"
                        />
                      </Form.Item>
                      <Button htmlType="submit" size="sm" loading={promoLoading}>
                        {t("apply")}
                      </Button>
                    </Form>
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">
                  {t("message_form_confirmation.total_price")}
                </th>
                <td className="dc-description-row-content">
                  <span>{`${asPrice(+price.total)} Lei`}</span>
                  {promo.code && (
                    <del className="ms-2">{`(${asPrice(+price.total + +promo.sum)}) Lei`}</del>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-terms">
          <Checkbox
            value={areTermsConfirmed}
            onChange={() => setAreTermsConfirmed((prev) => !prev)}
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
          <Button type="outline" onClick={updateTabsConfig(messageFormTabs.main, "prev")}>
            {t("back")}
          </Button>
          <Button onClick={onConfirmHandler} loading={loading} disabled={!areTermsConfirmed}>
            {t("message_form_confirmation.confirm")}
          </Button>
        </div>
      </PopupContent>
    </div>
  );
}

export default memo(MessageFormConfirmation);
