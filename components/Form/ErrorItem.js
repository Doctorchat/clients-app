import PropTypes from 'prop-types';

export default function Error(props) {
  const { error, isFormSubmitted } = props;

  if (!isFormSubmitted) return null;

  return 'error';
}

Error.propTypes = {
  error: PropTypes.object,
  isFormSubmitted: PropTypes.bool,
};

Error.defaultProps = {
  error: {},
};
