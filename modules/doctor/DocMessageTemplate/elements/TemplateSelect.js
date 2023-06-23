import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useOnClickOutside } from "usehooks-ts";

import Button from "@/components/Button";
import EmptyBox from "@/components/EmptyBox";
import TimesIcon from "@/icons/times.svg";
import api from "@/services/axios/api";
import cs from "@/utils/classNames";

import CommonStyles from "../styles/index.module.scss";
import Styles from "../styles/select.module.scss";

const TemplateSelectListItem = ({ doctor_id, title, content, onClick, onEditClick, onDeleteClick }) => {
  return (
    <div className={Styles.TemplateSelectListItem} onClick={onClick}>
      <div className={Styles.TemplateSelectListItemContent}>
        <h3 className="title">{title}</h3>
        <p className="description">{content}</p>
      </div>
      <div className={Styles.TemplateSelectListItemActions}>
        {Boolean(doctor_id) && (
          <>
            <button
              className={Styles.TemplateSelectListItemActionButton}
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            <button
              className={cs(Styles.TemplateSelectListItemActionButton, "danger")}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

TemplateSelectListItem.propTypes = {
  doctor_id: PropTypes.number,
  title: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

const TemplateSelectListItemSkeleton = () => {
  return (
    <div className={Styles.TemplateSelectListItem}>
      <div className={Styles.TemplateSelectListItemContent}>
        <div className="title skeleton" />
        <div className="description skeleton" />
      </div>
    </div>
  );
};

const TemplateSelectEmpty = ({ onActionClick }) => {
  const { t } = useTranslation();

  return (
    <div className={Styles.TemplateSelectEmpty}>
      <EmptyBox
        extra={
          <Button className="mt-2" size="sm" onClick={onActionClick}>
            {t("message_template.add_template")}
          </Button>
        }
      />
    </div>
  );
};

TemplateSelectEmpty.propTypes = {
  onActionClick: PropTypes.func,
};

export default function TemplateSelect({ onClose, onEditTemplate, onChooseTemplate, onCreateTemplate }) {
  const { t } = useTranslation();

  const ref = React.useRef();
  const queryClient = useQueryClient();
  const user = useSelector((store) => store.user.data);

  const { data: templates, isLoading } = useQuery(["templates"], () => api.messageTemplate.list(), {
    refetchOnWindowFocus: false,
  });
  const { mutate } = useMutation({
    mutationFn: (templateId) => api.messageTemplate.remove(templateId, user.id),
    onMutate: (templateId) => {
      const previousTemplates = queryClient.getQueryData(["templates"]);

      queryClient.cancelQueries(["templates"]);
      queryClient.setQueryData(["templates"], (old) => old.filter((t) => t.id !== templateId));

      return { previousTemplates };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["templates"], context.previousTemplates);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["templates"]);
    },
  });

  useOnClickOutside(ref, onClose);

  return (
    <div ref={ref} className={CommonStyles.PopupRoot}>
      <header className={CommonStyles.PopupHeader}>
        <div className="d-flex align-items-center">
          <h3 className={CommonStyles.PopupHeaderTitle}>{t("message_template.templates")}</h3>
          {templates && templates.length > 0 && (
            <Button type="text" size="sm" className="ms-2 px-2" onClick={onCreateTemplate}>
              {t("message_template.create_template")}
            </Button>
          )}
        </div>
        <button className={CommonStyles.PopupHeaderClose} onClick={onClose}>
          <TimesIcon />
        </button>
      </header>

      <div className={Styles.TemplateSelectList}>
        {isLoading && (
          <>
            <TemplateSelectListItemSkeleton />
            <TemplateSelectListItemSkeleton />
            <TemplateSelectListItemSkeleton />
          </>
        )}
        {templates?.map((template) => (
          <TemplateSelectListItem
            key={template.id}
            doctor_id={template.doctor_id}
            title={template.title}
            content={template.content}
            onClick={() => onChooseTemplate(template)}
            onEditClick={() => onEditTemplate(template)}
            onDeleteClick={() => mutate(template.id)}
          />
        ))}
        {!isLoading && (!templates || !templates?.length) && <TemplateSelectEmpty onActionClick={onCreateTemplate} />}
      </div>
    </div>
  );
}

TemplateSelect.propTypes = {
  onClose: PropTypes.func,
  onEditTemplate: PropTypes.func,
  onChooseTemplate: PropTypes.func,
  onCreateTemplate: PropTypes.func,
};
