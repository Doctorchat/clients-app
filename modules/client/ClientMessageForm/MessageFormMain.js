import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { messageFormSchema } from "@/services/validation";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import Upload, { ADD_FILE, REMOVE_FILE } from "@/components/Upload";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { messageFormTabs } from "@/context/TabsKeys";
import ImageIcon from "@/icons/file-img.svg";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import { messageFormSetConfirmation } from "@/store/slices/messageFormSlice";

export default function MessageFormMain() {
  const {
    messageForm: { values, chatId },
  } = useSelector((store) => ({ messageForm: store.messageForm }));
  const [loading, setLoading] = useState(false);
  const resolver = useYupValidationResolver(messageFormSchema);
  const form = useForm({ resolver });
  const { updateTabsConfig } = useTabsContext();
  const dispatch = useDispatch();

  const onFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        dispatch(messageFormSetConfirmation(values));
        updateTabsConfig(messageFormTabs.confirm)();
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

  const onFilesListUpdate = useCallback((actionType) => {
    if (actionType === REMOVE_FILE) {
      console.log("doc removed");
    } else if (actionType === ADD_FILE) {
      console.log("doc added");
    }
  }, []);

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
              <Form.Item name="content" label="Explică problema în detalii*">
                <Textarea placeholder="Exemplu: În urmă cu 3 zile, am început să am o durere de cap surdă care se resimte și în spatele ochilor. Pe lângă acest simptom, îmi curge nasul și uneori am amețeli, în special seara. Menționez că am început să am aceste simptome după ce m-am întors de la pescuit. Până acum nu a părut că simptomele s-au agravat, însă nici nu s-au ameliorat după ce am luat Paracetamol și Nurofen. Nu am făcut vreo investigație medicală în acest sens și nu am alte boli cronice. De asemenea, sunt fumător." />
              </Form.Item>
              <div className="message-form-uploads">
                <Form.Item name="images" label="Adaugă document / imagine">
                  <Upload
                    action={messageUploadFile(chatId)}
                    description="+15  lei / imagine, investigație de laborator, imagistică, etc"
                    icon={<ImageIcon />}
                    accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
                    onFileListUpdate={onFilesListUpdate}
                    displayList
                  />
                </Form.Item>
              </div>
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
