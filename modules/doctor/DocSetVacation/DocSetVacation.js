import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as yup from "yup";

import Button from "@/components/Button";
import Confirm from "@/components/Confirm";
import Form from "@/components/Form";
import MenuItem from "@/components/Menu/MenuItem";
import Popup from "@/components/Popup";
import Portal from "@/containers/Portal";
import useYupValidationResolver from "@/hooks/useYupValidationResolver";
import PalmIcon from "@/icons/palm.svg";
import DatePicker from "@/packages/DatePicker";
import api from "@/services/axios/api";
import { notification } from "@/store/slices/notificationsSlice";
import { updateUserProperty } from "@/store/slices/userSlice";
import getApiErrorMessages from "@/utils/getApiErrorMessages";
import moment from "@/utils/localMoment";

const schema = yup.object().shape({
  from: yup.string().required(),
  to: yup.string().required(),
});

export default function DocSetVacation() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user.data);
  const form = useForm({ defaultValues: { from: null, to: null }, resolver: useYupValidationResolver(schema) });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openSetVacationForm = () => setIsOpen(true);

  const clearVacation = useCallback(async () => {
    try {
      await api.user.resetVacation();
      dispatch(updateUserProperty({ prop: "vacation", value: null, as_send: true }));
      dispatch(notification({ type: "success", title: "success", descrp: "data_updated_with_success" }));
      form.reset();
      return Promise.resolve();
    } catch (error) {
      dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      return Promise.reject();
    }
  }, [dispatch, form]);

  const onSubmitHandler = useCallback(
    async (values) => {
      try {
        setLoading(true);

        const range = [values.from, values.to];
        await api.user.setVacation({ range });

        dispatch(updateUserProperty({ prop: "vacation", value: range, as_send: true }));
        dispatch(notification({ type: "success", title: "success", descrp: "data_updated_with_success" }));
        setIsOpen(false);
        form.reset();
      } catch (error) {
        dispatch(notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form]
  );

  const from = form.watch("from");

  const isDateDisabled = useCallback(
    (name, date) => {
      if (name === "from") {
        return date.isBefore(moment());
      }

      if (name === "to" && from) {
        return date.isBefore(moment(from, "DD.MM.YYYY").add(1, "days"));
      }

      return false;
    },
    [from]
  );

  return (
    <>
      <MenuItem icon={<PalmIcon />} onClick={openSetVacationForm}>
        {t("vacation")}
      </MenuItem>
      <Portal portalName="modalRoot">
        <Popup
          id="vacation-form"
          visible={isOpen}
          onVisibleChange={() => {
            setIsOpen(false);
            form.reset();
          }}
        >
          <Popup.Header title={t("set_vacation")} />
          <div className="p-2">
            <Form
              methods={form}
              onFinish={onSubmitHandler}
              initialValues={{
                from: user?.vacation && user.vacation.length ? user.vacation[0] : null,
                to: user?.vacation && user.vacation.length ? user.vacation[1] : null,
              }}
            >
              <Form.Item label={t("range_picker_placeholder.start")} name="from">
                <DatePicker skipNativeDisableDate additionalCheckDisabledDay={(d) => isDateDisabled("from", d)} />
              </Form.Item>
              <Form.Item label={t("range_picker_placeholder.end")} name="to">
                <DatePicker
                  disabled={!from}
                  skipNativeDisableDate
                  additionalCheckDisabledDay={(d) => isDateDisabled("to", d)}
                />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Confirm
                  content={t("cancel_vacation_confirmation")}
                  onConfirm={clearVacation}
                  disabled={!user.vacation || !user?.vacation?.length}
                  isAsync
                >
                  <Button type="outline" disabled={!user.vacation || !user?.vacation?.length}>
                    {t("cancel")}
                  </Button>
                </Confirm>
                <Button className="ms-2" htmlType="submit" loading={loading}>
                  {t("apply")}
                </Button>
              </div>
            </Form>
          </div>
        </Popup>
      </Portal>
    </>
  );
}
