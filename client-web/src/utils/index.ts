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

export const produceNfmtItems = (array = []) => {
  const result = [];
  const rareTotal = 20;
  const uniqueTotal = 1;

  for (const item of array) {
    if (item.tokenType === 'NFMT') {
      for (let i = 0; i < item.balances.length; i++) {
        const tokenBalance = item.balances[i];
        const tokenType = +item.contractTokenIds[i];
        const total = item.maxSupplies.find((supply, i) => tokenType === i + 1);
        const traits = item.traits.map(trait =>
          trait.find((el, i) => tokenType === i + 1),
        );
        total < rareTotal && traits.push('Rare');
        total === uniqueTotal && traits.push('Unique!');
        const resItem = {
          ...item,
          balance: tokenBalance,
          nfmtType: tokenType,
          total: total,
          traits,
        };
        +tokenBalance > 0 && result.push(resItem);
      }
    }
  }
  return result;
};

export const filterNftBalances = (item) => {
  return (
    (item.tokenType === "NFT" || item.tokenType === "NFMT") &&
    (item.balance > 0 ||
      (item.balances.length && item.balances.some((item) => +item > 0)))
  );
};