import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "antd";
import en_US from "antd/lib/locale-provider/en_US";
import ro_RO from "antd/lib/locale-provider/ro_RO";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import dayjs from "dayjs";
import moment from "moment";
import PropTypes from "prop-types";

import api from "@/services/axios/api";
import cs from "@/utils/classNames";
import getActiveLng from "@/utils/getActiveLng";

const antLocales = {
  ro: ro_RO,
  ru: ru_RU,
  en: en_US,
};

const TimeCard = ({ time, isSelected, isDisabled, onClick }) => {
  return (
    <div
      role="button"
      className={cs("time-selection__time-card", isSelected && "selected", isDisabled && "disabled")}
      onClick={onClick}
    >
      {time}
    </div>
  );
};

TimeCard.propTypes = {
  time: PropTypes.string,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export const TimeSelection = ({ doctorId, onSelectSlot }) => {
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [selectedSlotId, setSelectedSlotId] = React.useState(null);
  const { t } = useTranslation();

  const { data } = useQuery(["slots", doctorId], () => api.user.slots(doctorId).then((res) => res.data), {
    refetchOnWindowFocus: false,
    enabled: Boolean(doctorId),
    onSuccess: (data) => {
      if (!data[0]?.start_time) return;
      setSelectedDate(moment(data[0].start_time));
    },
  });

  const onChangeSelectedDate = React.useCallback((date) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
  }, []);

  const onChangeSelectedSlot = React.useCallback(
    (slotId) => {
      setSelectedSlotId(slotId);
      onSelectSlot(slotId);
    },
    [onSelectSlot]
  );

  return (
    <>
      <div className="message-form__time-selection">
        <div className="time-selection__date">
          <Calendar
            mode="month"
            fullscreen={false}
            value={moment(selectedDate)}
            onSelect={onChangeSelectedDate}
            disabledDate={(date) => {
              return !data?.find((slot) => dayjs(slot.start_time).isSame(date, "day"));
            }}
            locale={antLocales[getActiveLng()]?.Calendar ?? antLocales.ro.Calendar}
          />
        </div>

        <div className="d-flex flex-column text-center justify-content-center">
          <div className="message-info-hour">
            <h7 className="message-info-hour-locale">{t("hour_info_locale")}</h7>
          </div>
          <h5 className="mb-2 mt-2 mb-sm-4 mt-sm-0">{t("ora_dvs_locala")}</h5>

          <div className="time-selection__time pt-0">
            {data?.map((slot) => {
              const date = dayjs(slot.start_time);
              const isSelected = selectedSlotId === slot.id;
              const isDisabled = date.isBefore(moment().add(1, "hours"));

              return (
                date.isSame(selectedDate, "day") && (
                  <TimeCard
                    key={slot.id}
                    time={date.format("HH:mm")}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onChangeSelectedSlot(isSelected ? null : slot.id);
                      }
                    }}
                  />
                )
              );
            })}
          </div>
        </div>
      </div>
      <p className="message-form__time-selection-info alert alert-info">
        <Trans i18nKey="wizard:time_selection_warning" components={{ bold: <b /> }} />
      </p>
    </>
  );
};

TimeSelection.propTypes = {
  doctorId: PropTypes.number,
  onSelectSlot: PropTypes.func,
};
