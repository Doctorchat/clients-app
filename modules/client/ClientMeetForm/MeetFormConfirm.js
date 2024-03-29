import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import { PopupContent, PopupHeader } from "@/components/Popup";
import { MESSAGE_TYPES } from "@/context/constants";
import { meetFormTabs } from "@/context/TabsKeys";
import useCurrency from "@/hooks/useCurrency";
import useMessageFromValues from "@/hooks/useMessageFromValues";
import useRegion from "@/hooks/useRegion";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import api from "@/services/axios/api";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { meetFormReset, meetFormToggleVisibility } from "@/store/slices/meetFormSlice";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

const promoInputReplacer = (value) => {
  if (value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  return value;
};

function MeetFormConfirmation() {
  const { updateTabsConfig } = useTabsContext();
  const {
    meetForm: { values, chatId, uploads },
  } = useSelector((store) => ({ meetForm: store.meetForm }));
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [price, setPrice] = useState({ doc: 0, uploads: 0, subtotal: 0, total: 0, discount: 0 });
  const [promo, setPromo] = useState({ code: "", sum: 0 });
  const [areTermsConfirmed, setAreTermsConfirmed] = useState(false);
  const form = useForm();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const dispatch = useDispatch();

  const { resetValues: resetPersistedValues } = useMessageFromValues(chatId);

  const { data: walletData } = useQuery(["wallet"], () => api.wallet.get(), {
    keepPreviousData: true,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
  });

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

        setPromo({ code, sum: price.subtotal - discoutedPrice });
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
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
      payload.isMeet = true;
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
        dispatch(meetFormToggleVisibility(false));
        dispatch(meetFormReset());
      }

      resetPersistedValues();
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setLoading(false);
    }
  }, [values, chatId, promo.code, uploads.list, dispatch, resetPersistedValues]);

  const totalPrice = +price.total - +promo.sum;
  const toPayPrice = Math.max(0, +totalPrice - (+walletData?.data?.balance ?? 0));

  return (
    <div className="popup-body message-from-confirm">
      <PopupHeader
        title={<BackTitle title={t("confirmation")} onBack={updateTabsConfig(meetFormTabs.main, "prev")} />}
      />
      <PopupContent>
        <div className="confirmation-section">
          <table>
            <tbody>
              <tr className="dc-description-title">
                <th colSpan="2">{t("message_form_confirmation.summary")}</th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.description")}</th>
                <td className="dc-description-row-content">{values.content}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.datetime")}</th>
                <td className="dc-description-row-content">{`${values.date} ${values.time}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label"> {t("terms_conditions")}</th>
                <td className="dc-description-row-content">
                  <a href={`${HOME_PAGE_URL}termeni-si-conditii/`} target="_blank" rel="noreferrer noopener">
                    {t("terms_conditions")}
                  </a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.basic_price")}</th>
                <td className="dc-description-row-content">{`${formatPrice(+price.doc)}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{`${t("message_form_confirmation.files")}(${
                  values.uploads_count
                })`}</th>
                <td className="dc-description-row-content">{`+${formatPrice(+price.uploads)}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.subtotal_price")}</th>
                <td className="dc-description-row-content">{`${formatPrice(+price.subtotal)}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ConfirmationSection />
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
                        {t("message_form_confirmation.code")}: <mark className="dc-mark">{promo.code}</mark>
                      </span>
                      <span>
                        {t("message_form_confirmation.discount")}:{" "}
                        <mark className="dc-mark">{formatPrice(+promo.sum)}</mark>
                      </span>
                    </>
                  ) : (
                    <Form methods={form} onFinish={onPromocodeApplied} className="promo-code-form">
                      <Form.Item name="code">
                        <Input pattern={promoInputReplacer} autoComplete="off" placeholder="WINTER20" size="sm" />
                      </Form.Item>
                      <Button htmlType="submit" size="sm" loading={promoLoading}>
                        {t("apply")}
                      </Button>
                    </Form>
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("message_form_confirmation.total_price")}</th>
                <td className="dc-description-row-content">
                  <span>{`${formatPrice(+totalPrice)}`}</span>
                  {promo.code && <del className="ms-2">{`(${formatPrice(+price.total)})`}</del>}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{t("to_pay")}</th>
                <td className="dc-description-row-content to-pay-row">
                  {formatPrice(+toPayPrice)}
                  {walletData?.data?.balance > 0 && (
                    <span>
                      ({t("your_account_will_be_debited")}{" "}
                      <strong>
                        {formatPrice(totalPrice > walletData.data.balance ? walletData.data.balance : totalPrice)}
                      </strong>
                      )
                    </span>
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
                  href={`${HOME_PAGE_URL}termeni-si-conditii/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="terms"
                >
                  {t("terms_conditions")}
                </a>
              </>
            }
          />
        </div>
        <div className="confirmation-actions">
          <Button type="outline" onClick={updateTabsConfig(meetFormTabs.main, "prev")}>
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

export default memo(MeetFormConfirmation);

export const ConfirmationSection = () => {
  const { t } = useTranslation();
  const region = useRegion();
  const content = {
    md: {
      payment: {
        title: "Stripe",
        url: "https://stripe.com/",
      },
      company: "„WEBMEDCONSULT” OU",
      product: "Doctorchat",
      address: "Harju, Tallin, districtul Kesklinna, Ahtri tn 12, 1015, Estonia",
      phone: "+373 78 272 887",
      email: "info@doctorchat.md",
    },
    ro: {
      payment: {
        title: "Stripe",
        url: "https://stripe.com/",
      },
      company: "„WEBMEDCONSULT” OU",
      product: "Doctorchat",
      address: "Harju, Tallin, districtul Kesklinna, Ahtri tn 12, 1015, Estonia",
      phone: "+40 758 670 067",
      email: "infodoctorchat.ro@gmail.com",
    },
  };
  const regionContent = content[region];
  return (
    <div className="confirmation-section">
      <table>
        <tbody>
          <tr className="dc-description-title">
            <th colSpan="2">
              <div className="dc-description-title-trunc">
                <span>{t("message_form_confirmation.payment_security")}</span>
                <a href={regionContent.payment.url} target="_blank" rel="noreferrer">
                  {regionContent.payment.title}
                </a>
              </div>
            </th>
          </tr>
          <tr className="dc-description-row">
            <th className="dc-description-row-label">{t("message_form_confirmation.company")}</th>
            <td className="dc-description-row-content">{regionContent.company}</td>
          </tr>
          <tr className="dc-description-row">
            <th className="dc-description-row-label">{t("message_form_confirmation.product")}</th>
            <td className="dc-description-row-content">{regionContent.product}</td>
          </tr>
          <tr className="dc-description-row">
            <th className="dc-description-row-label"> {t("message_form_confirmation.address")}</th>
            <td className="dc-description-row-content">{regionContent.address}</td>
          </tr>
          <tr className="dc-description-row">
            <th className="dc-description-row-label">{t("email")}</th>
            <td className="dc-description-row-content">
              <a href={`mailto:${regionContent.email}`}>{regionContent.email}</a>
            </td>
          </tr>
          <tr className="dc-description-row">
            <th className="dc-description-row-label">{t("phone")}</th>
            <td className="dc-description-row-content">
              <a href={`tel:${regionContent.phone}`}>{regionContent.phone}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
