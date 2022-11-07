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
import { Box } from "@mui/system";
import { FullPageSpinner } from "./FullPageSpinner";
import { useStoreState } from "../store";

export interface IEditAcl {
  userId: string;
  updateData?(): Promise<void>;
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
const checkAdminEnabled = (acl: TPermission) => {
  if (!acl) return false;
  return !!Object.entries(acl).find((item) => item[0] === "admin" && !!item[1]);
};
const Row = ({
  name,
  row,
  onChange,
  disableAllRow,
}: {
  name: TKeys;
  row: TPermission;
  disableAllRow: boolean;
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
      <TableCell
        style={{
          backgroundColor: !checkDisabled(row?.disabled, "create")
            ? "white"
            : "lightgrey",
        }}
        align="left"
      >
        <Checkbox
          checked={row?.create}
          name={"create"}
          disabled={checkDisabled(row?.disabled, "create") || disableAllRow}
          onChange={(e) => onChange(e, name)}
          {...label}
        />
      </TableCell>
      <TableCell
        style={{
          backgroundColor: !checkDisabled(row?.disabled, "read")
            ? "white"
            : "lightgrey",
        }}
        align="left"
      >
        <Checkbox
          name={"read"}
          onChange={(e) => onChange(e, name)}
          disabled={checkDisabled(row?.disabled, "read") || disableAllRow}
          checked={row?.read}
          {...label}
        />
      </TableCell>
      <TableCell
        style={{
          backgroundColor: !checkDisabled(row?.disabled, "update")
            ? "white"
            : "lightgrey",
        }}
        align="left"
      >
        <Checkbox
          name={"update"}
          onChange={(e) => onChange(e, name)}
          disabled={checkDisabled(row?.disabled, "update") || disableAllRow}
          checked={row?.update}
          {...label}
        />
      </TableCell>
      <TableCell
        style={{
          backgroundColor: !checkDisabled(row?.disabled, "delete")
            ? "white"
            : "lightgrey",
        }}
        align="left"
      >
        <Checkbox
          name={"delete"}
          onChange={(e) => onChange(e, name)}
          disabled={checkDisabled(row?.disabled, "delete") || disableAllRow}
          checked={row?.delete}
          {...label}
        />
      </TableCell>
      <TableCell
        style={{
          backgroundColor: !checkDisabled(row?.disabled, "admin")
            ? "white"
            : "lightgrey",
        }}
        align="left"
      >
        <Checkbox
          name={"admin"}
          onChange={(e) => onChange(e, name)}
          disabled={checkDisabled(row?.disabled, "admin") || disableAllRow}
          checked={row?.admin}
          {...label}
        />
      </TableCell>
    </TableRow>
  );
};

export const EditAcl: React.FC<IEditAcl> = ({ userId, updateData }) => {
  const [userAcl, setUserAcl] = useState<IUserAcl>();
  const [userAclApplicationKeys, setUserAclApplicationKeys] = useState<
    Array<TKeys>
  >([]);
  const [userAclNetworkKeys, setUserAclNetworkKeys] = useState<Array<TKeys>>(
    []
  );
  const myAcl = useStoreState((state) => state.ACL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("userAclApplicationKeys ", userAclApplicationKeys);
  }, [userAclApplicationKeys]);

  const getAcl = async () => {
    setLoading(true);
    try {
      const { data } = await getUserAcl(userId);
      console.log("getAcl ", data);
      setUserAcl(data);
      const appKeys = Object.keys(data.result.application) as TKeys[];
      const networkKeys = Object.keys(data.result.network) as TKeys[];

      setUserAclApplicationKeys(appKeys);
      setUserAclNetworkKeys(networkKeys);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
    setLoading(true);
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

      await updateUserAcl(userId, body);
      if (updateData) {
        await updateData();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAcl();
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Typography marginBottom={"10px"} fontWeight={"bold"}>
        Applications
      </Typography>

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
            {myAcl.result &&
              userAclApplicationKeys.map((row) => {
                const application = userAcl!.result.application[row];
                const myApplicationAcl = myAcl!.result.application[row];

                return (
                  <Row
                    disableAllRow={!checkAdminEnabled(myApplicationAcl)}
                    // disableAllRow={false}
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
      <Typography marginBottom={"10px"} marginTop={"10px"} fontWeight={"bold"}>
        Networks
      </Typography>

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
            {/* {userAclNetworkKeys.map((row) => {
              const network = userAcl!.result.network.netStats;
              const myNetworkAcl = myAcl!.result.network.netStats;

              return (
                <Row
                  disableAllRow={!checkAdminEnabled(myNetworkAcl)}
                  // disableAllRow={false}
                  onChange={onNetworkAclChange}
                  name={row}
                  row={network}
                  key={row}
                />
              );
            })} */}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button variant="contained" onClick={updateAcl}>
          Update Acl
        </Button>
      </Box>
    </>
  );
};
