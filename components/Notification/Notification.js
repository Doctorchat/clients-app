import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { IconBtn } from "../Button";
import cs from "@/utils/classNames";
import TimesIcon from "@/icons/times.svg";
import CheckIcon from "@/icons/check.svg";
import WarnIcon from "@/icons/warning.svg";
import { notificationRemove, notificationRemovedTrigger } from "@/store/slices/notificationsSlice";

export const defaultNotificationData = {
  duration: 3000,
  type: "success",
};

const calculateNotificationTop = (nodeKey) => {
  const notificationsList = document.querySelectorAll("#notifications-wrapper .notification");
  let top = 20;

  for (let i = 0; i < notificationsList.length; i++) {
    if (nodeKey === notificationsList[i].dataset?.key) {
      if (notificationsList.length === 0) top += 20;
      break;
    }

    top += notificationsList[i].offsetHeight + 10;
  }

  return top;
};

function Notification(props) {
  const {
    trigger,
    data: { id, className, type, title, descrp, duration },
  } = props;
  const [mounted, setMouted] = useState(false);
  const notificationRef = useRef();
  const [notificationTop, setNotificationTop] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setMouted(true);
  }, [id]);

  useEffect(() => {
    setNotificationTop(calculateNotificationTop(id));
  }, [id, mounted, trigger]);

  const onNotificationDestroyed = useCallback(
    () => dispatch(notificationRemovedTrigger()),
    [dispatch]
  );

  const destroyAnimation = useCallback(() => {
    dispatch(notificationRemove({ id }));
    setMouted(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (duration) {
      setTimeout(destroyAnimation, duration);
    }
  }, [destroyAnimation, duration]);

  const Icon = useMemo(() => {
    switch (type) {
      case "error":
        return <TimesIcon />;
      case "warning":
        return <WarnIcon />;
      default:
        return <CheckIcon />;
    }
  }, [type]);

  return (
    <CSSTransition
      in={mounted}
      timeout={200}
      nodeRef={notificationRef}
      onExited={onNotificationDestroyed}
      unmountOnExit
    >
      <div
        className={cs("notification", className, type)}
        style={{ "--top": notificationTop + "px" }}
        ref={notificationRef}
        data-key={id}
      >
        <i className="notification-icon">{Icon}</i>
        <div className="notification-caption">
          <h4 className="title">{title}</h4>
          {typeof descrp === "string" ? <p className="description">{descrp}</p> : descrp}
        </div>
        <IconBtn
          className="notification-destroy"
          size="sm"
          icon={<TimesIcon />}
          onClick={destroyAnimation}
        />
      </div>
    </CSSTransition>
  );
}

Notification.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.oneOf(["error", "success", "warning"]),
    title: PropTypes.string,
    descrp: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  trigger: PropTypes.bool,
};

Notification.defaultProps = {
  data: {
    duration: 3000,
    type: "success",
  },
};

export default memo(Notification);
