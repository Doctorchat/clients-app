import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { meetFormSchema } from "@/services/validation";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { meetFormTabs } from "@/context/TabsKeys";
import { notification } from "@/store/slices/notificationsSlice";
import { meetFormSetConfirmation } from "@/store/slices/meetFormSlice";
import DatePicker from "@/packages/DatePicker";
import TimePicker from "@/packages/TimePicker";

export default function MeetFormMain() {
  const {
    meetForm: { values, chatId },
  } = useSelector((store) => ({ meetForm: store.meetForm }));
  const [loading, setLoading] = useState(false);
  const resolver = useYupValidationResolver(meetFormSchema);
  const form = useForm({ resolver, defaultValues: { date: null } });
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {

      try {
        setLoading(true);
        dispatch(meetFormSetConfirmation(values));
        updateTabsConfig(meetFormTabs.confirm)();
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "Eroare", description: "A apărut o eroare" })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, updateTabsConfig]
  );

  return (
    <div className="popup-body message-form-main">
      <PopupHeader title="Forma de expediere" />
      <PopupContent>
        <div className="message-form">
          <div className="message-form-info">
            <h3>Pentru a primi un răspuns cât mai util, asigurați-vă că descrieți:</h3>
            <p>
              <strong>Contextul</strong> apariției problemei medicale (cum și când)
            </p>
            <p>
              <strong>Simptomele</strong> resimțite în detaliu
            </p>
            <p>
              <strong>Evoluția</strong> problemei în timp
            </p>
            <p>
              Investigații <strong>sau</strong> intervenții{" "}
              <strong>medicale făcute în acest sens </strong>
            </p>
          </div>
          <div className="message-form-inputs">
            <Form methods={form} onFinish={onFormSubmit}>
              <div className="flex-group d-flex gap-2 flex-sm-nowrap flex-wrap">
                <Form.Item className="w-100" name="date" label="Data">
                  <DatePicker />
                </Form.Item>
                <Form.Item className="w-100" name="time" label="Ora">
                  <TimePicker />
                </Form.Item>
              </div>
              <Form.Item name="content" label="Explică problema în detalii*">
                <Textarea placeholder="Exemplu: În urmă cu 3 zile, am început să am o durere de cap surdă care se resimte și în spatele ochilor. Pe lângă acest simptom, îmi curge nasul și uneori am amețeli, în special seara. Menționez că am început să am aceste simptome după ce m-am întors de la pescuit. Până acum nu a părut că simptomele s-au agravat, însă nici nu s-au ameliorat după ce am luat Paracetamol și Nurofen. Nu am făcut vreo investigație medicală în acest sens și nu am alte boli cronice. De asemenea, sunt fumător." />
              </Form.Item>
              <div className="message-form-bottom">
                <div className="message-price">
                  <span className="message-price-active">185 Lei</span>
                  <span className="message-price-old">325 Lei</span>
                </div>
                <Button htmlType="submit" loading={loading}>
                  Continuă
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </PopupContent>
    </div>
  );
}
