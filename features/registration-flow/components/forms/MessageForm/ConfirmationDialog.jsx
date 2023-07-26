import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useBoolean } from "usehooks-ts";

import BackTitle from "@/components/BackTitle";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Popup from "@/components/Popup";
import useCurrency from "@/hooks/useCurrency";
import usePaymentAction from "@/hooks/usePaymentAction";
import { HOME_PAGE_URL } from "@/hooks/useRegion";
import { ConfirmationSection } from "@/modules/client/ClientMeetForm/MeetFormConfirm";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { toggleTopUpModal } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";

import { ConfirmationDialogPromo } from "./ConfirmationDialogPromo";

export const ConfirmationDialog = ({ data, visible, onClosePopup }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { isAllowed } = usePaymentAction();

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.data);

  const { value: areTermsAccepted, toggle: onChangeAreTermsccepted } = useBoolean(false);

  const [loading, setLoading] = React.useState(false);
  const [promocode, setPromocode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(data?.price + data?.uploads_price);

  const onConfirmHandler = React.useCallback(async () => {
    if (isAllowed(totalPrice)) {
      try {
        setLoading(true);
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
    } else {
      dispatch(notification({ type: "error", title: "error", descrp: "top-up.insufficient_funds" }));
      dispatch(toggleTopUpModal(true));
    }
  }, [data, dispatch, isAllowed, promocode, router, totalPrice]);

  React.useEffect(() => {
    setTotalPrice(data?.price + data?.uploads_price);
  }, [data?.price, data?.uploads_price]);

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
                  <th colSpan="2">{t("message_form_confirmation.summary")}</th>
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
                {!user?.company_id && (
                  <>
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
                      <td className="dc-description-row-content">{`${formatPrice(
                        data.uploads_price + data.price
                      )}`}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {!user?.company_id && (
            <>
              <ConfirmationSection />

              <div className="confirmation-section">
                <table>
                  <tbody>
                    <tr className="dc-description-title">
                      <th colSpan="2">{t("message_form_confirmation.have_promo")}</th>
                    </tr>
                    <tr className="dc-description-row">
                      <td className="dc-description-row-content promo-code-row">
                        <ConfirmationDialogPromo
                          discount={discount}
                          promocode={promocode}
                          setDiscount={setDiscount}
                          setPromocode={setPromocode}
                          totalPrice={totalPrice}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
      <div className="confirmation-footer">
        <div className="confirmation-terms">
          <Checkbox
            name="terms"
            value={areTermsAccepted}
            onChange={() => onChangeAreTermsccepted(!areTermsAccepted)}
            label={
              <>
                {t("accept_terms")}{" "}
                <a
                  href={`${HOME_PAGE_URL}termeni-si-conditii/`}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="terms"
                >
                  {t("terms_conditions")}
                </a>
              </>
            }
          />
          {!user?.company_id && (
            <div className="confirmation-terms__to-pay">
              <span>{t("to_pay")}:</span>
              <span className="ms-1">{`${formatPrice(totalPrice - discount)}`}</span>
              {promocode && <del className="ms-1">{`(${formatPrice(totalPrice)})`}</del>}
            </div>
          )}
        </div>
        <div className="confirmation-actions">
          <Button type="outline" onClick={onClosePopup}>
            {t("back")}
          </Button>
          <Button disabled={!areTermsAccepted} loading={loading} onClick={onConfirmHandler}>
            {user?.company_id ? t("continue") : t("message_form_confirmation.confirm")}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

ConfirmationDialog.propTypes = {
  data: PropTypes.object,
  visible: PropTypes.bool,
  onClosePopup: PropTypes.func,
};
