import PropTypes from "prop-types";
import { Children, cloneElement, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Error from "./ErrorItem";
import cs from "@/utils/classNames";

export default function FormItem(props) {
  const { name, label, className, children } = props;
  const { control } = useFormContext();

  const formControl = useCallback(
    ({ field, fieldState: { invalid, error } }) => (
      <div className={cs(className, "form-control", invalid && "invalid")}>
        {cloneElement(Children.only(children), { ...field, label })}
        <Error error={error} />
      </div>
    ),
    [children, className, label]
  );

  return <Controller control={control} name={name} render={formControl} />;
}

FormItem.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
};
