import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import cs from "@/utils/classNames";

export default function FormList(props) {
  const { className, name, children } = props;
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className={cs("form-control_list", className)}>
      {children({
        fields,
        add: append,
        remove,
      })}
    </div>
  );
}

FormList.propTypes = {
  name: PropTypes.string,
  children: PropTypes.func,
  className: PropTypes.string,
};
