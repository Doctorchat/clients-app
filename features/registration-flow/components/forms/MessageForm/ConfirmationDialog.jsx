import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import Input from "@/components/Inputs";
import Popup from "@/components/Popup";
import useCurrency from "@/hooks/useCurrency";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import { ConfirmationSection } from "@/modules/client/ClientMeetForm/MeetFormConfirm";

const promoInputReplacer = (value) => {
  if (value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  return value;
};

export const ConfirmationDialog = ({ data, visible, onClosePopup }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const dispatch = useDispatch();
  const router = useRouter();

  const { value: areTermsAccepted, toggle: onChangeAreTermsccepted } = useBoolean(false);

  const [loading, setLoading] = React.useState(false);
  const [promoLoading, setPromoLoading] = React.useState(false);
  const [promocode, setPromocode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(data?.price + data?.uploads_price);

  const form = useForm();

  const onApplyPromocode = React.useCallback(
    async ({ code }) => {
      setPromoLoading(true);

      try {
        const response = await api.conversation.promo(code);

        setPromocode(code);
        setDiscount((totalPrice * response.data) / 100);
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setPromoLoading(false);
        form.reset();
      }
    },
    [dispatch, form, totalPrice]
  );

  const onConfirmHandler = React.useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.conversation.addMessage({ ...data, code: promocode });

      if (process.env.NEXT_PUBLIC_API_REGION === "ro") {
        window.dataLayer?.push({
          event: "initiate_checkout",
        });
      }

      if (response.data.redirect) {
        window.location.replace(response.data.redirect);
      } else {
        await router.push(`/chat?id=${response.data.chat_id}`);
      }
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
    } finally {
      setLoading(false);
    }
  }, [data, dispatch, promocode, router]);

  React.useEffect(() => {
    setTotalPrice(data?.price + data?.uploads_price);
  }, [data?.price, data?.uploads_price]);

  const formCodeValue = form.watch("code");

  return (
    <Popup
      className="registration-flow__modal message-confirmation__modal"
      visible={visible}
      onVisibleChange={onClosePopup}
    >
      <Popup.Header title={<BackTitle title={t("confirmation")} onBack={onClosePopup} />} />
      {data && (
        <div className="message-confirmation__content">
          <div className="confirmation-section">
            <table>
              <tbody>
                <tr className="dc-description-title">
                  <th colSpan="2">{t("message_form_confirmation.symmary")}</th>
                </tr>
                <tr className="dc-description-row">
                  <th className="dc-description-row-label">{t("message_form_confirmation.description")}</th>
                  <td className="dc-description-row-content">{data.content}</td>
                </tr>
                <tr className="dc-description-row">
                  <th className="dc-description-row-label">{t("terms_conditions")}</th>
                  <td className="dc-description-row-content">
                    <a href={`${HOME_PAGE_URL}termeni-si-conditii/`} target="_blank" rel="noreferrer noopener">
                      {t("terms_conditions")}
                    </a>
                  </td>
                </tr>
                <tr className="dc-description-row">
                  <th className="dc-description-row-label">{t("message_form_confirmation.basic_price")}</th>
                  <td className="dc-description-row-content">{`${formatPrice(data.price)}`}</td>
                </tr>
                <tr className="dc-description-row">
                  <th className="dc-description-row-label">{`${t("message_form_confirmation.files")}(${
                    data.uploads_count
                  })`}</th>
                  <td className="dc-description-row-content">{`+${formatPrice(data.uploads_price)}`}</td>
                </tr>
                <tr className="dc-description-row">
                  <th className="dc-description-row-label">{t("message_form_confirmation.subtotal_price")}</th>
                  <td className="dc-description-row-content">{`${formatPrice(data.uploads_price + data.price)}`}</td>
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
                  <td className="dc-description-row-content promo-code-row">
                    {promocode ? (
                      <>
                        <span className="d-block">
                          {t("message_form_confirmation.code")}: <mark className="dc-mark">{promocode}</mark>
                        </span>
                        <span className="mt-1 d-block">
                          {t("message_form_confirmation.discount")}:{" "}
                          <mark className="dc-mark">{formatPrice(discount)}</mark>
                        </span>
                      </>
                    ) : (
                      <Form methods={form} onFinish={onApplyPromocode} className="promo-code-form">
                        <Form.Item label={t("message_form_confirmation.code")} name="code">
                          <Input pattern={promoInputReplacer} autoComplete="off" placeholder="WINTER20" />
                        </Form.Item>
                        <Button htmlType="submit" loading={promoLoading} disabled={!formCodeValue}>
                          {t("apply")}
                        </Button>
                      </Form>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="confirmation-terms mb-4">
            <Checkbox
              name="terms"
              value={areTermsAccepted}
              onChange={() => onChangeAreTermsccepted(!areTermsAccepted)}
              label={
                <>
                  {t("accept_terms")}{" "}
                  <a
                    href={`${HOME_PAGE_URL}/termeni-si-conditii/`}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="terms"
                  >
                    {t("terms_conditions")}
                  </a>
                </>
              }
            />
            <div className="confirmation-terms__to-pay">
              <span>{t("to_pay")}:</span>
              <span className="ms-1">{`${formatPrice(totalPrice - discount)}`}</span>
              {promocode && <del className="ms-1">{`(${formatPrice(totalPrice)})`}</del>}
            </div>
          </div>
          <div className="confirmation-actions">
            <Button type="outline" onClick={onClosePopup}>
              {t("back")}
            </Button>
            <Button disabled={!areTermsAccepted} loading={loading} onClick={onConfirmHandler}>
              {t("message_form_confirmation.confirm")}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};

ConfirmationDialog.propTypes = {
  data: PropTypes.object,
  visible: PropTypes.bool,
  onClosePopup: PropTypes.func,
};
