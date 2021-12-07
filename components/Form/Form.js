import PropTypes from "prop-types";
import { FormProvider } from "react-hook-form";
import FormItem from "./FormItem";
import FormList from "./FormList";

export default function Form(props) {
  const { name, className, methods, onFinish, children } = props;
  const { handleSubmit } = methods;

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
};

Form.Item = FormItem;
Form.List = FormList;
