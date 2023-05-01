import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import EditIcon from "@/icons/edit.svg";
import TrashIcon from "@/icons/trash.svg";
import cs from "@/utils/classNames";
import { calculateAge } from "@/utils/date";

import { IconBtn } from "../Button";
import Confirm from "../Confirm";
import DcTooltip from "../DcTooltip";

export default function InvestigationItem(props) {
  const { name, birth_date, weight, height, withActions, onEdit, onRemove, removeDisabled } = props;
  const { t } = useTranslation();

  const onEditHandler = useCallback(() => {
    onEdit(props.id);
  }, [onEdit, props.id]);

  const onRemoveHandler = useCallback(
    (id) => () => {
      onRemove(id);
    },
    [onRemove]
  );

  const age = calculateAge(birth_date)?.years;
  const ageToRender = !isNaN(age) ? age : "-";

  return (
    <div className={cs("investigation-item position-relative", !withActions && "no-actions")}>
      <div className="investigation-item-caption">
        <h4 className="title">{name}</h4>
        {withActions && (
          <div className="investigation-actions">
            <DcTooltip content={t("edit")} side="left" align="center">
              <IconBtn icon={<EditIcon />} size="sm" onClick={onEditHandler} />
            </DcTooltip>
            {!removeDisabled && (
              <Confirm onConfirm={onRemoveHandler(props.id)} content={t("remove_investigation_confirmation")} isAsync>
                <DcTooltip content={t("remove")} side="left" align="center">
                  <IconBtn icon={<TrashIcon />} className="remove-action" size="sm" />
                </DcTooltip>
              </Confirm>
            )}
          </div>
        )}
      </div>
      <div className="investigation-item-descrp">
        <div className="descrp-item">
          <span className="value">{ageToRender}</span>
          <span className="label">{t("age")}</span>
        </div>
        <div className="descrp-item">
          <span className="value">{weight}</span>
          <span className="label">{t("weight")}</span>
        </div>
        <div className="descrp-item">
          <span className="value">{height}</span>
          <span className="label">{t("height")}</span>
        </div>
      </div>
    </div>
  );
}

InvestigationItem.propTypes = {
  age: PropTypes.number,
  weight: PropTypes.number,
  height: PropTypes.number,
  name: PropTypes.string,
  withActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  id: PropTypes.number,
  removeDisabled: PropTypes.bool,
};

InvestigationItem.defaultProps = {
  onEdit: () => null,
  onRemove: () => null,
};
