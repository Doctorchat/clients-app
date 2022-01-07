import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function AuthRoleWrapper(props) {
  const { roles, extraValidation, children } = props;
  const user = useSelector((store) => store.user);
  

  if (roles.includes(user.data.role) && extraValidation) return children;

  return null;
}

AuthRoleWrapper.propTypes = {
  roles: PropTypes.array,
  children: PropTypes.any,
  extraValidation: PropTypes.any,
};

AuthRoleWrapper.defaultProps = {
  extraValidation: true,
};
