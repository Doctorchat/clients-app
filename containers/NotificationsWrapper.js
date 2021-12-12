import { useSelector } from "react-redux";
import { TransitionGroup } from "react-transition-group";
import Notification from "@/components/Notification";

export default function NotificationsWrapper() {
  const notifications = useSelector((store) => store.notifications);

  return (
    <div id="notifications-wrapper">
      <TransitionGroup>
        {notifications.list.map((ntf) => (
          <Notification key={ntf.id} data={ntf} trigger={notifications.trigger} />
        ))}
      </TransitionGroup>
    </div>
  );
}
