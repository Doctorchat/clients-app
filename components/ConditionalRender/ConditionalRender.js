import PropTypes from "prop-types";

import useRegion from "@/hooks/useRegion";

export const REGION_RO = "ro";
export const REGION_MD = "md";
const ConditionalRender = ({ hide = false, hideOnRegion, children }) => {
  const currentRegion = useRegion();

  if (hide) {
    return null;
  }

  if (hideOnRegion === currentRegion) {
    return null;
  }

  return children;
};

ConditionalRender.propTypes = {
  hide: PropTypes.bool,
  hideOnRegion: PropTypes.oneOf(["ro", "md"]),
  children: PropTypes.element.isRequired,
};

ConditionalRender.defaultProps = {
  hide: false,
  hideOnRegion: null,
};

export default ConditionalRender;
