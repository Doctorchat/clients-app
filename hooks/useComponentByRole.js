import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "@/components/Spinner";

/**
 * @typedef {Object} Component
 * @property {Number} role - The Component allowed user role
 * @property {Promise<Function>} getComponent - Promise which return lazy load Component
 * @property {Object} props - The Component props
 */

/**
 * @param {Component[]} components
 * @param {Function} fallback
 * @returns {Function} Allowed Component
 */
export default function useComponentByRole(components, fallback) {
  const user = useSelector((store) => store.user);
  const [loaded, setLoaded] = useState(false); // Prevent further re-rendering
  const component = useRef();
  const props = useRef();

  const loadAllowedComponent = async (activeComponent) => {
    const lazyComponent = await activeComponent.getComponent();

    component.current = lazyComponent;
    props.current = activeComponent.props;

    setLoaded(true);
  };

  const getFallback = () => {
    if (!fallback) {
      return (
        <div className="lazy-load-fallback">
          <Spinner />
        </div>
      );
    }

    return fallback;
  };

  useEffect(() => {
    if (!loaded && user.data?.role) {
      const activeComponent = components.find((component) => component.role === user.data.role);

      if (activeComponent) {
        loadAllowedComponent(activeComponent);
      }
    }
  }, [components, loaded, user.data?.role]);

  return component.current ? <component.current {...props.current} /> : getFallback();
}
