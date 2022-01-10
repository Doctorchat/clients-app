import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import MeetFormDateTime from "./MeetFormDateTime";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import { meetFormSchema } from "@/services/validation";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { Textarea } from "@/components/Inputs";
import Upload from "@/components/Upload";
import { PopupHeader, PopupContent } from "@/components/Popup";
import useTabsContext from "@/packages/Tabs/hooks/useTabsContext";
import { meetFormTabs } from "@/context/TabsKeys";
import ImageIcon from "@/icons/file-img.svg";
import { messageUploadFile } from "@/store/actions";
import { notification } from "@/store/slices/notificationsSlice";
import { meetFormSetConfirmation, meetFormUpdateUploads } from "@/store/slices/meetFormSlice";

export default function MeetFormMain() {
  const {
    meetForm: { values, chatId, uploads },
    userInfo,
    global,
  } = useSelector((store) => ({
    meetForm: store.meetForm,
    userInfo: store.userInfo.data,
    global: store.bootstrap.payload?.global,
  }));
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState({ list: [], price: 0, initiated: false });
  const { updateTabsConfig } = useTabsContext();
  const resolver = useYupValidationResolver(meetFormSchema);
  const form = useForm({ resolver });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!attachments.initiated && uploads?.list) {
      setAttachments({ ...uploads, initiated: true });
    }
  }, [attachments.initiated, uploads]);

  const onFormSubmit = useCallback(
    async (values) => {
      const data = { ...values };

      data.uploads_count = attachments.list.length;
      data.uploads_price = attachments.list.length * global.attach;
      data.price = userInfo?.meet_price;

      try {
        setLoading(true);
        dispatch(meetFormSetConfirmation(data));
        updateTabsConfig(meetFormTabs.confirm)();
      } catch (error) {
        dispatch(
          notification({ type: "error", title: "Eroare", description: "A apărut o eroare" })
        );
      } finally {
        setLoading(false);
      }
    },
    [attachments.list.length, dispatch, global.attach, updateTabsConfig, userInfo?.meet_price]
  );

  const setFileList = useCallback(
    (fileList) => {
      const newAttachments = { list: fileList, price: fileList.length * global.attach };

      setAttachments({ ...newAttachments, initiated: true });
      dispatch(meetFormUpdateUploads(newAttachments));
    },
    [dispatch, global.attach]
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
            <Form
              methods={form}
              onFinish={onFormSubmit}
              initialValues={{ content: values.content, date: values.date, time: values.time }}
            >
              <MeetFormDateTime daysRange={userInfo?.disponibility} />
              <Form.Item name="content" label="Explică problema în detalii*">
                <Textarea placeholder="Exemplu: În urmă cu 3 zile, am început să am o durere de cap surdă care se resimte și în spatele ochilor. Pe lângă acest simptom, îmi curge nasul și uneori am amețeli, în special seara. Menționez că am început să am aceste simptome după ce m-am întors de la pescuit. Până acum nu a părut că simptomele s-au agravat, însă nici nu s-au ameliorat după ce am luat Paracetamol și Nurofen. Nu am făcut vreo investigație medicală în acest sens și nu am alte boli cronice. De asemenea, sunt fumător." />
              </Form.Item>
              <div className="message-form-uploads">
                <Form.Item name="uploads" label="Adaugă document / imagine">
                  <Upload
                    action={messageUploadFile(chatId)}
                    description="+15  lei / imagine, investigație de laborator, imagistică, etc"
                    icon={<ImageIcon />}
                    accept=".png,.jpeg,.jpg,.bmp,.doc,.docx,.pdf,.xlsx,.xls"
                    fileList={attachments.list}
                    setFileList={setFileList}
                    defaultFileList={attachments.list}
                    displayList
                  />
                </Form.Item>
              </div>
              <div className="message-form-bottom">
                <div className="message-price">
                  <span className="message-price-active">
                    {userInfo?.meet_price + attachments.price} Lei
                  </span>
                  {/* <span className="message-price-old">325 Lei</span> */}
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
