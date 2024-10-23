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
    permissions: ["admin", "participant"],
  },
  {
    id: "giveXCoins",
    name: "Give X coins",
    icon: Group,
    color: "#0052CD",
    permissions: ["admin", "participant"],
  },
  {
    id: "reply",
    name: "Reply",
    icon: Reply,
    color: "#000000",
    permissions: ["all"],
  },
  {
    id: "forward",
    name: "Forward",
    icon: Forward,
    color: "#000000",
    permissions: ["all"],
  },
  {
    id: "copy",
    name: "Copy",
    icon: Copy,
    color: "#000000",
    permissions: ["all"],
  },
  {
    id: "delete",
    name: "Delete",
    icon: Delete,
    color: "#000000",
    permissions: ["admin"],
  },
  {
    id: "edit",
    name: "Edit",
    icon: Edit,
    color: "#000000",
    permissions: ["admin", "participant"],
  },
  {
    id: "report",
    name: "Report",
    icon: Report,
    color: "#000000",
    permissions: ["all"],
  },
];
