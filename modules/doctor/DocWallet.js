import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { InputNumber } from "@/components/Inputs";

export default function DocWallet() {
  const { user } = useSelector((store) => ({
    user: store.user.data,
    transactionsList: store.transactionsList,
  }));
  const { t } = useTranslation();

  return (
    <div className="doc-wallet">
      <h3 className="total">{user.private?.balance} Lei</h3>
      <div className="d-flex justify-content-between gap-3">
        <div className="position-relative">
          <p className="m-0" style={{ fontSize: 14, paddingLeft: 4 }}>
            {t("price_message")}
          </p>
          <InputNumber readOnly format="decimal" value={user.private?.chat} addonBefore="MDL" />
        </div>
        <div className="position-relative">
          <p className="m-0" style={{ fontSize: 14, paddingLeft: 4 }}>
            {t("price_meet")}
          </p>
          <InputNumber
            readOnly
            format="decimal"
            value={user.private?.meet || 0}
            addonBefore="MDL"
          />
        </div>
      </div>
    </div>
  );
}
