import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, Typography } from "@mui/material";
import {
  getUserAcl,
  IAclBody,
  IUserAcl,
  TPermission,
  updateUserAcl,
} from "../http";

export interface IEditAcl {
  userId: string;
}

const label = { inputProps: { "aria-label": "Checkbox" } };
type TKeys =
  | "appCreate"
  | "appPush"
  | "appSettings"
  | "appStats"
  | "appTokens"
  | "appUsers";

const checkDisabled = (arr: Array<string> | undefined, property: string) => {
  if (!arr) return false;
  return !!arr.find((item) => item === property);
};

const Row = ({
  name,
  row,
  onChange,
}: {
  name: TKeys;
  row: TPermission;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    keyToChange: TKeys
  ) => void;
}) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="left">
        <Checkbox
          checked={row?.create}
          name={"create"}
          onChange={(e) => onChange(e, name)}
          disabled={checkDisabled(row?.disabled, "create")}
          {...label}
        />
      </TableCell>
      <TableCell align="left">
        <Checkbox
          name={"read"}
          onChange={(e) => onChange(e, name)}
          checked={row?.read}
          disabled={checkDisabled(row?.disabled, "read")}
          {...label}
        />
      </TableCell>
      <TableCell align="left">
        <Checkbox
          name={"update"}
          onChange={(e) => onChange(e, name)}
          checked={row?.update}
          disabled={checkDisabled(row?.disabled, "update")}
          {...label}
        />
      </TableCell>
      <TableCell align="left">
        <Checkbox
          name={"delete"}
          onChange={(e) => onChange(e, name)}
          checked={row?.delete}
          disabled={checkDisabled(row?.disabled, "delete")}
          {...label}
        />
      </TableCell>
      <TableCell align="left">
        <Checkbox
          name={"admin"}
          onChange={(e) => onChange(e, name)}
          checked={row?.admin}
          disabled={checkDisabled(row?.disabled, "admin")}
          {...label}
        />
      </TableCell>
    </TableRow>
  );
};

export const EditAcl: React.FC<IEditAcl> = ({ userId }) => {
  const [userAcl, setUserAcl] = useState<IUserAcl>();
  const [userAclApplicationKeys, setUserAclApplicationKeys] = useState<
    Array<TKeys>
  >([]);
  const [userAclNetworkKeys, setUserAclNetworkKeys] = useState<Array<TKeys>>(
    []
  );

  const getAcl = async () => {
    try {
      const { data } = await getUserAcl(userId);
      setUserAcl(data);
      const appKeys = Object.keys(data.result.application) as TKeys[];
      const networkKeys = Object.keys(data.result.network) as TKeys[];

      setUserAclApplicationKeys(appKeys);
      setUserAclNetworkKeys(networkKeys);
    } catch (error) {
      console.log(error);
    }
  };

  const onApplicationAclChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyToChange: TKeys
  ) => {
    setUserAcl((prev) => ({
      result: {
        ...prev!.result,
        application: {
          ...prev!.result!.application,
          [keyToChange]: {
            ...prev!.result!.application[keyToChange],
            [e.target.name]: e.target.checked,
          },
        },
      },
    }));
  };
  const onNetworkAclChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyToChange: TKeys
  ) => {
    setUserAcl((prev) => ({
      result: {
        ...prev!.result,
        network: {
          ...prev!.result!.network,
          netStats: {
            ...prev!.result!.network.netStats,
            [e.target.name]: e.target.checked,
          },
        },
      },
    }));
  };

  const updateAcl = async () => {
    try {
      const filteredApplication = Object.fromEntries(
        Object.entries(userAcl!.result!.application).map((item) => {
          delete item[1].disabled;
          return item;
        })
      );
      const filteredNetwork = Object.fromEntries(
        Object.entries(userAcl!.result!.network).map((item) => {
          delete item[1].disabled;
          return item;
        })
      );

      const body = {
        application: filteredApplication,
        network: filteredNetwork,
      } as IAclBody;

      const res = await updateUserAcl(userId, body);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAcl();
  }, []);

  return (
    <>
      <Typography>Applications</Typography>

      <TableContainer component={Paper}>
        <Table size={"small"} sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Create</TableCell>
              <TableCell align="left">Read</TableCell>
              <TableCell align="left">Update</TableCell>
              <TableCell align="left">Delete</TableCell>
              <TableCell align="left">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userAclApplicationKeys.map((row) => {
              const application = userAcl!.result.application[row];

              return (
                <Row
                  onChange={onApplicationAclChange}
                  name={row}
                  row={application}
                  key={row}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography>Networks</Typography>

      <TableContainer component={Paper}>
        <Table size={"small"} sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>

              <TableCell>Create</TableCell>
              <TableCell align="left">Read</TableCell>
              <TableCell align="left">Update</TableCell>
              <TableCell align="left">Delete</TableCell>
              <TableCell align="left">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userAclNetworkKeys.map((row) => {
              const network = userAcl!.result.network.netStats;
              return (
                <Row
                  onChange={onNetworkAclChange}
                  name={row}
                  row={network}
                  key={row}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={updateAcl}>Update Acl</Button>
    </>
  );
};
