import PropTypes from "prop-types";
import { Children, cloneElement, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormItemHelp from "./FormItemHelp";
import Error from "./ErrorItem";
import cs from "@/utils/classNames";

export default function FormItem(props) {
  const { name, label, className, children, disabled, help } = props;
  const { control } = useFormContext();
  const [animateLabel, setAnimateLabel] = useState(false);

  useEffect(() => {
    // Prevent label transition on first render
    setTimeout(() => setAnimateLabel(true), 200);
  }, []);

  const formControl = useCallback(
    ({ field, fieldState: { invalid, error } }) => (
      <div className={cs(className, "form-control", invalid && "invalid")}>
        {cloneElement(Children.only(children), { ...field, label, disabled, animateLabel })}
        <FormItemHelp hasError={!!error?.message} help={help} />
        <Error error={error} />
      </div>
    ),
    [animateLabel, children, className, disabled, label, help]
  );

  return <Controller control={control} name={name} render={formControl} />;
}

FormItem.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  help: PropTypes.string,
};
