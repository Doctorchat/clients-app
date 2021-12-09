import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function AuthRoleWrapper(props) {
  const { roles, children } = props;
  const user = useSelector((store) => store.user);

  if (roles.includes(user.data.role)) return children;

  return null;
}

AuthRoleWrapper.propTypes = {
  roles: PropTypes.array,
  children: PropTypes.any,
};
