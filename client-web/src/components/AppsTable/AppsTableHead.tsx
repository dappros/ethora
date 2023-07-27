import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Tooltip,
  Box,
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
    label: "Display Name",
    align: "left",
  },
  {
    id: "users",
    numeric: true,
    disablePadding: false,
    label: "Users",
    description: "Users registered (total vs 24h)",
    align: "center",
  },
  {
    id: "sessions",
    numeric: true,
    disablePadding: false,

    label: "Sessions",
    description: "User sessions (total vs 24h)",
    align: "center",
  },
  {
    id: "chats",
    numeric: true,
    disablePadding: false,
    label: "Chats",
    description: "Chat messages (total vs 24h)",
    align: "center",
  },
  {
    id: "api",
    numeric: true,
    disablePadding: false,
    label: "API",
    description: "API calls (total vs 24h)",
    align: "center",
  },
  {
    id: "files",
    numeric: true,
    disablePadding: false,
    label: "Files",
    description: "Files (total vs 24h)",
    align: "center",
  },
  {
    id: "web3",
    numeric: true,
    disablePadding: false,
    label: "Web3",
    description: "Blockchain transactions (total vs 24h)",
    align: "center",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,

    label: "Created",
    description: "App creation date",
    align: "center",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,

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
            <Box style={{display: 'inline-flex', alignItems: 'center'}}>
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
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
