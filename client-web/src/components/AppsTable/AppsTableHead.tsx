import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

type CellId =
  | "displayName"
  | "users"
  | "sessions"
  | "chats"
  | "api"
  | "files"
  | "web3"
  | "createdAt"
  | "actions";

type TableCellAlign = "inherit" | "left" | "center" | "right" | "justify";
interface HeadCell {
  disablePadding: boolean;
  id: CellId;
  disableSorting: boolean;
  label: string;
  numeric: boolean;
  description?: string;
  align: TableCellAlign;
}

const headCells: readonly HeadCell[] = [
  {
    id: "displayName",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "Display Name",
    align: "left",
  },
  {
    id: "users",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "Users",
    description: "Users registered (total vs 24h)",
    align: "center",
  },
  {
    id: "sessions",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Sessions",
    description: "User sessions (total vs 24h)",
    align: "center",
  },
  {
    id: "chats",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "Chats",
    description: "Chat messages (total vs 24h)",
    align: "center",
  },
  {
    id: "api",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "API",
    description: "API calls (total vs 24h)",
    align: "center",
  },
  {
    id: "files",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "Files",
    description: "Files (total vs 24h)",
    align: "center",
  },
  {
    id: "web3",
    numeric: true,
    disablePadding: false,
    disableSorting: false,
    label: "Web3",
    description: "Blockchain transactions (total vs 24h)",
    align: "center",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Created",
    description: "Files (total vs 24h)",
    align: "center",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Actions",
    align: "right",
  },
];
export const AppsTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            <TableSortLabel disabled={headCell.disableSorting}>
              {headCell.label}
              {!!headCell.description && (
                <Tooltip title={headCell.description}>
                  <InfoIcon
                    color="primary"
                    fontSize={"small"}
                    sx={{ marginLeft: 1 }}
                  />
                </Tooltip>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
