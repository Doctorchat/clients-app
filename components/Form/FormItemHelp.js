import PropTypes from "prop-types";

export default function FormItemHelp(props) {
  const { help, hasError } = props;

  if (!help || hasError) {
    return null;
  }

  return <div className="form-item-help">{help}</div>;
}

FormItemHelp.propTypes = {
  help: PropTypes.string,
  hasError: PropTypes.bool,
};
