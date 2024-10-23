import Group from "../../../assets/interactions/Group.svg";
import Reply from "../../../assets/interactions/Reply.svg";
import Forward from "../../../assets/interactions/Forward.svg";
import Copy from "../../../assets/interactions/Copy.svg";
import Delete from "../../../assets/interactions/Delete.svg";
import Edit from "../../../assets/interactions/Edit.svg";
import Report from "../../../assets/interactions/Report.svg";

export const options = [
  {
    id: "give1Coin",
    name: "Give 1 coin",
    icon: Group,
    color: "#0052CD",
    isUser: true,
  },
  {
    id: "giveXCoins",
    name: "Give X coins",
    icon: Group,
    color: "#0052CD",
    isUser: true,
  },
  {
    id: "reply",
    name: "Reply",
    icon: Reply,
    color: "#000000",
  },
  {
    id: "forward",
    name: "Forward",
    icon: Forward,
    color: "#000000",
  },
  {
    id: "copy",
    name: "Copy",
    icon: Copy,
    color: "#000000",
  },
  {
    id: "edit",
    name: "Edit",
    icon: Edit,
    color: "#000000",
    isUser: false,
  },
  {
    id: "delete",
    name: "Delete",
    icon: Delete,
    color: "#000000",
    isModerator: true,
  },
  {
    id: "report",
    name: "Report",
    icon: Report,
    color: "#000000",
  },
];
