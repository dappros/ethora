import React, { useEffect, useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Button, Checkbox, Typography } from "@mui/material"
import {
  ACL,
  getUserAcl,
  IAclBody,
  IOtherUserACL,
  IUser,
  IUserAcl,
  TPermission,
  updateUserAcl,
} from "../http"
import { Box } from "@mui/system"
import { FullPageSpinner } from "./FullPageSpinner"
import { useStoreState } from "../store"
import { useSnackbar } from "../context/SnackbarContext"

export interface IEditAcl {
  updateData?(user: IOtherUserACL): void
  onAclError?: () => void
  user: IUser
}

const label = { inputProps: { "aria-label": "Checkbox" } }
type TKeys =
  | "appCreate"
  | "appPush"
  | "appSettings"
  | "appStats"
  | "appTokens"
  | "appUsers"

const checkDisabled = (array: Array<string> | undefined, property: string) => {
  if (!array) return false
  return !!array.find((item) => item === property)
}
const checkAdminEnabled = (acl: TPermission) => {
  if (!acl) return false
  return !!Object.entries(acl).find((item) => item[0] === "admin" && !!item[1])
}
const Row = ({
  name,
  row,
  onChange,
  disableAllRow,
}: {
  name: TKeys
  row: TPermission
  disableAllRow: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>, keyToChange: TKeys) => void
}) => {
  const isOwner = useStoreState((state) => state.user?.ACL?.ownerAccess)
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
          backgroundColor: checkDisabled(row?.disabled, "create")
            ? "lightgrey"
            : "white",
        }}
        align="left"
      >
        <Checkbox
          checked={row?.create}
          name={"create"}
          disabled={
            (checkDisabled(row?.disabled, "create") || disableAllRow) &&
            !isOwner
          }
          onChange={(e) => onChange(e, name)}
          {...label}
        />
      </TableCell>
      <TableCell
        style={{
          backgroundColor: checkDisabled(row?.disabled, "read")
            ? "lightgrey"
            : "white",
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
          backgroundColor: checkDisabled(row?.disabled, "update")
            ? "lightgrey"
            : "white",
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
          backgroundColor: checkDisabled(row?.disabled, "delete")
            ? "lightgrey"
            : "white",
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
          backgroundColor: checkDisabled(row?.disabled, "admin")
            ? "lightgrey"
            : "white",
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
  )
}

export const EditAcl: React.FC<IEditAcl> = ({
  updateData,
  onAclError,
  user,
}) => {
  const [userAcl, setUserAcl] = useState<IOtherUserACL>({ result: user.acl })
  const [userAclApplicationKeys, setUserAclApplicationKeys] = useState<
    Array<TKeys>
  >([])
  const [userAclNetworkKeys, setUserAclNetworkKeys] = useState<Array<TKeys>>([])
  const acl = useStoreState((state) =>
    state.ACL.result.find((a) => a.appId === userAcl?.result?.appId)
  )
  const myAcl = {
    result: acl,
  }
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const getAcl = async () => {
    setUserAcl({ result: user.acl })
    const appKeys = Object.keys(userAcl.result.application) as TKeys[]
    const networkKeys = Object.keys(userAcl.result.network) as TKeys[]
    setUserAclApplicationKeys(appKeys)
    setUserAclNetworkKeys(networkKeys)
  }
  const onApplicationAclChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyToChange: TKeys
  ) => {
    setUserAcl((previous) => ({
      result: {
        ...previous!.result,
        application: {
          ...previous!.result!.application,
          [keyToChange]: {
            ...previous!.result!.application[keyToChange],
            [e.target.name]: e.target.checked,
          },
        },
      },
    }))
  }
  const onNetworkAclChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyToChange: TKeys
  ) => {
    setUserAcl((previous) => ({
      result: {
        ...previous!.result,
        network: {
          ...previous!.result!.network,
          netStats: {
            ...previous!.result!.network.netStats,
            [e.target.name]: e.target.checked,
          },
        },
      },
    }))
  }

  const updateAcl = async () => {
    setLoading(true)
    const application: ACL = JSON.parse(
      JSON.stringify(userAcl!.result!.application)
    )
    const network: ACL = JSON.parse(JSON.stringify(userAcl!.result!.network))

    try {
      const filteredApplication = Object.fromEntries(
        Object.entries(application).map((item) => {
          delete item[1].disabled
          return item
        })
      )
      const filteredNetwork = Object.fromEntries(
        Object.entries(network).map((item) => {
          delete item[1].disabled

          return item
        })
      )

      const body = {
        application: filteredApplication,
        network: filteredNetwork,
      } as IAclBody

      const aclRes = await updateUserAcl(user._id, user.appId, body)
      const updatedUserAcl = aclRes.data as IOtherUserACL
      if (updateData) {
        updateData(updatedUserAcl)
      }
      showSnackbar("success", "ACL updated successfully")
    } catch (error) {
      showSnackbar(
        "error",
        "Cannot change ACL " +
          error?.response?.data?.error?.details[0]?.message || ""
      )
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      getAcl()
    }
  }, [user])

  if (loading) {
    return <FullPageSpinner />
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
                const application = userAcl!.result.application[row]
                const myApplicationAcl = myAcl!.result.application[row]

                return (
                  <Row
                    disableAllRow={!checkAdminEnabled(myApplicationAcl)}
                    // disableAllRow={false}
                    onChange={onApplicationAclChange}
                    name={row}
                    row={application}
                    key={row}
                  />
                )
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
            {userAclNetworkKeys.map((row) => {
              const network = userAcl!.result.network.netStats
              const myNetworkAcl = myAcl!.result.network.netStats

              return (
                <Row
                  disableAllRow={!checkAdminEnabled(myNetworkAcl)}
                  // disableAllRow={false}
                  onChange={onNetworkAclChange}
                  name={row}
                  row={network}
                  key={row}
                />
              )
            })}
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
  )
}
