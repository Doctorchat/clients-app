import { memo } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { PopupContent, PopupHeader } from "@/components/Popup";
import Button from "@/components/Button";
import Input from "@/components/Inputs";
import { messageFormTabs } from "@/context/TabsKeys";
import BackTitle from "@/components/BackTitle";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import Form from "@/components/Form";

function MessageFormConfirmation() {
  const { updateTabsConfig } = useTabsContext();
  const {
    messageForm: { confirmation },
  } = useSelector((store) => ({ messageForm: store.messageForm }));
  const form = useForm();

  return (
    <div className="popup-body message-from-confirm">
      <PopupHeader
        title={
          <BackTitle title="Confirmare" onBack={updateTabsConfig(messageFormTabs.main, "prev")} />
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
                <td className="dc-description-row-content">{confirmation.content}</td>
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
                <td className="dc-description-row-content">185 Lei</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Fișiere(0)</th>
                <td className="dc-description-row-content">+0 Lei</td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Subtotal</th>
                <td className="dc-description-row-content">185 Lei</td>
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
                  <Form methods={form} className="promo-code-form">
                    <Form.Item name="code">
                      <Input autoComplete="off" placeholder="WINTER20" size="sm" />
                    </Form.Item>
                    <Button htmlType="submit" size="sm">
                      Aplică
                    </Button>
                  </Form>
                </td>
              </tr>
              <tr className="dc-description-row">
                <th className="dc-description-row-label">Total</th>
                <td className="dc-description-row-content">185 Lei</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="confirmation-actions">
          <Button type="outline" onClick={updateTabsConfig(messageFormTabs.main, "prev")}>
            Înapoi
          </Button>
          <Button>Confirmă și Achită</Button>
        </div>
      </PopupContent>
    </div>
  );
}

export default memo(MessageFormConfirmation);
