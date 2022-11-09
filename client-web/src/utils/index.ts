import * as React from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/images/dpp.png";

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
export const truncateString = (input: string, textLength: number) => {
  return input.length > textLength
    ? `${input.substring(0, textLength)}...`
    : input;
};

export function checkNotificationsStatus() {
  if (!("Notification" in window)) {
    return console.log("This browser does not support system notifications!");
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      console.log(permission);
    });
  }
}
export function sendBrowserNotification(
  body: string,
  onNotificationClick: () => void
) {
  const notification = new Notification("New message from Ethora", {
    icon: logo,
    body: body,
  });
  notification.onclick = onNotificationClick;
}
