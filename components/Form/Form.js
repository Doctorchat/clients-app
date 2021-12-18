import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider } from "react-hook-form";
import FormItem from "./FormItem";
import FormList from "./FormList";

export default function Form(props) {
  const { name, className, methods, onFinish, onValuesChange, children } = props;
  const { handleSubmit } = methods;
  const subscription = useRef(null);

  const onFormChange = useCallback(
    (values, { type, name }) => {
      if (type === "change" && onValuesChange) {
        onValuesChange({ name, value: values[name] }, values);
      }
    },
    [onValuesChange]
  );

  useEffect(() => {
    if (methods) {
      subscription.current = methods.watch(onFormChange);
    }

    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
      }
    };
  }, [methods, onFormChange]);

  return (
    <FormProvider {...methods}>
      <form className={className} id={name} onSubmit={handleSubmit(onFinish)}>
        {children}
      </form>
    </FormProvider>
  );
}

Form.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  methods: PropTypes.object,
  onFinish: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onValuesChange: PropTypes.func,
};

Form.Item = FormItem;
Form.List = FormList;
