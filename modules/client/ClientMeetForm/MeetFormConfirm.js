import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { PopupContent, PopupHeader } from "@/components/Popup";
import Button from "@/components/Button";
import Input from "@/components/Inputs";
import { meetFormTabs } from "@/context/TabsKeys";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Form from "@/components/Form";
import { notification } from "@/store/slices/notificationsSlice";
import api from "@/services/axios/api";
import { updateConversation } from "@/store/slices/conversationListSlice";
import { meetFormReset, meetFormToggleVisibility } from "@/store/slices/meetFormSlice";
import { MESSAGE_TYPES } from "@/context/constants";

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
        setPromo({ code, sum: price.subtotal - discoutedPrice });
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "Eroare", descrp: "Acest cod nu este valid" })
        );
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
      payload.type = MESSAGE_TYPES.meet;
      payload.code = promo.code;
      payload.uploads = uploads.list.map(({ file_id }) => file_id);

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
    } catch (error) {
      dispatch(notification({ type: "error", title: "Eroare", descrp: "A apărut o eroare" }));
    } finally {
      setLoading(false);
    }
  }, [values, chatId, promo.code, uploads, dispatch]);

  return (
    <div className="popup-body message-from-confirm">
      <PopupHeader
        title={
          <BackTitle title="Confirmare" onBack={updateTabsConfig(meetFormTabs.main, "prev")} />
        }
      />
      <PopupContent>
        <div className="confirmation-section">
          <table>
            <tbody>
              <tr className="dc-description-title">
                <th colSpan="2">Sumar întrebare</th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Descriere</th>
                <td className="dc-description-row-content">{values.content}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Data și ora</th>
                <td className="dc-description-row-content">{`${values.date} ${values.time}`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Termeni și condiții</th>
                <td className="dc-description-row-content">
                  <a href="/terms-and-conditions" target="_blank">
                    Termeni și condiții
                  </a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Prețul</th>
                <td className="dc-description-row-content">{`${price.doc} Lei`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">{`Fișiere(${values.uploads_count})`}</th>
                <td className="dc-description-row-content">{`+${price.uploads} Lei`}</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Subtotal</th>
                <td className="dc-description-row-content">{`${price.subtotal} Lei`}</td>
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
                    <span>Achitare sigură prin</span>
                    <a href="#" target="_blank">
                      MobilPay
                    </a>
                  </div>
                </th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Companie</th>
                <td className="dc-description-row-content">WEBMEDCONSULT SRL</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Produs</th>
                <td className="dc-description-row-content">DoctorChat</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Adresa</th>
                <td className="dc-description-row-content">
                  Bucureşti, sector 6, Splaiul Independenţei nr. 273, corp 3, etaj 3
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Email</th>
                <td className="dc-description-row-content">
                  <a href="mailto:clienti@doctorchat.md">clienti@doctorchat.md</a>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Telefon</th>
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
                <th colSpan="2">Aveți un promo-code?</th>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Code</th>
                <td className="dc-description-row-content promo-code-row">
                  {promo.code ? (
                    <>
                      <span className="d-block">
                        Promo-code: <mark className="dc-mark">{promo.code}</mark>
                      </span>
                      <span>
                        Reducere: <mark className="dc-mark">{promo.sum} Lei</mark>
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
                        Aplică
                      </Button>
                    </Form>
                  )}
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Total</th>
                <td className="dc-description-row-content">
                  <span>{`${price.total} Lei`}</span>
                  {promo.code && <del className="ms-2">{`${price.total + promo.sum} Lei`}</del>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-actions">
          <Button type="outline" onClick={updateTabsConfig(meetFormTabs.main, "prev")}>
            Înapoi
          </Button>
          <Button onClick={onConfirmHandler} loading={loading}>
            Confirmă și Achită
          </Button>
        </div>
      </PopupContent>
    </div>
  );
}

export default memo(MeetFormConfirmation);
