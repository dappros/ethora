import { MessageModel } from "@chatscope/chat-ui-kit-react";
import { format } from "date-fns";
import * as React from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/images/dpp.png";
import { mobileEthoraBaseUrl } from "../constants";
import { ILineChartData } from "../pages/Profile/types";
import { TMessageHistory } from "../store";

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
    if (item.tokenType === "NFMT") {
      for (let i = 0; i < item.balances.length; i++) {
        const tokenBalance = item.balances[i];
        const tokenType = +item.contractTokenIds[i];
        const total = item.maxSupplies.find((supply, i) => tokenType === i + 1);
        const traits = item.traits.map((trait) =>
          trait.find((el, i) => tokenType === i + 1)
        );
        total < rareTotal && traits.push("Rare");
        total === uniqueTotal && traits.push("Unique!");
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
      (item.balances?.length && item?.balances?.some((item) => +item > 0)))
  );
};

interface IProfileLink {
  firstName: string;
  lastName: string;
  walletAddress: string;
  xmppId: string;
  linkToken?: string;
}

export const generateProfileLink = ({
  firstName,
  lastName,
  walletAddress,
  xmppId,
  linkToken,
}: IProfileLink) => {
  return `${mobileEthoraBaseUrl}=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}&linkToken=${
    linkToken ?? ""
  }`;
};
export const generateChatLink = ({ roomAddress }: { roomAddress: string }) => {
  if (!roomAddress) return "";
  const splitedAddress = roomAddress.split("@")[0];
  return `${mobileEthoraBaseUrl}${splitedAddress}`;
};
interface IDocLink {
  linkToken: string;
}

export const generateDocumentLink = ({ linkToken }: IDocLink) => {
  return `https://app-dev.dappros.com/v1/docs/share/${linkToken}`;
};

export type TChartData = { date: string; y: number }[];

export const transformDataForLineChart = (
  data: ILineChartData,
  dateFormat: string = "MM.dd.yyyy"
): TChartData => {
  const result: TChartData = [];
  for (let index = 0; index < data.x.length; index++) {
    const elementX = format(new Date(data.x[index]), dateFormat);
    const elementY = data.y[index];
    result.push({ date: elementX, y: elementY });
  }
  return result;
};

export type IMessagePosition = {
  position: MessageModel["position"];
  type: string;
  separator?: string;
};

export const getPosition = (
  arr: TMessageHistory[],
  message: TMessageHistory,
  index: number
) => {
  const previousJID = arr[index - 1]?.data.senderJID?.split("/")[0];
  const nextJID = arr[index + 1]?.data.senderJID?.split("/")[0];
  const currentJID = message.data.senderJID?.split("/")[0];

  let result: IMessagePosition = {
    position: "single",
    type: "single",
  };

  if (arr[index - 1] && message) {
    if (
      format(new Date(arr[index - 1]?.date), "dd") !==
      format(new Date(message.date), "dd")
    ) {
      result.separator = format(new Date(message.date), "EEEE, dd LLLL yyyy");
    }
  }

  if (previousJID !== currentJID && nextJID !== currentJID) {
    return result;
  }

  if (previousJID !== currentJID && nextJID === currentJID) {
    result.position = "first";
    result.type = "first";
    return result;
  }

  if (previousJID === currentJID && nextJID === currentJID) {
    result.position = "normal";
    result.type = "normal";
    return result;
  }

  if (
    previousJID === currentJID &&
    nextJID !== currentJID &&
    arr[index - 1]?.data.isSystemMessage === "false"
  ) {
    result.position = "single";
    result.type = "last";
    return result;
  }

  return result;
};

export const stripHtml = (html: string) => {
  let doc: any;
  let str = html;

  str = str.replace(/<br>/gi, "\n");
  str = str.replace(/<p.*>/gi, "\n");
  str = str.replace(/<(?:.|\s)*?>/g, "");

  if (str.trim().length === 0) {
    doc = new DOMParser().parseFromString(html, "text/html");
  } else {
    doc = new DOMParser().parseFromString(str, "text/html");
  }
  return doc.body.textContent || "";
};
