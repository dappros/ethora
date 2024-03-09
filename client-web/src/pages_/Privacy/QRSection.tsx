/* eslint-disable unicorn/filename-case */
import { Button } from "@mui/material"
import { Box } from "@mui/system"
import * as React from "react"
import QRCode from "react-qr-code"
import { CONFERENCEDOMAIN } from "../../constants"
import { TUser } from "../../store"
import {
  generateDocumentLink,
  generateProfileLink,
  truncateString,
} from "../../utils"
import { walletToUsername } from "../../utils/walletManipulation"
import { ISharedLink } from "./ProfileShareTab"

interface QRSectionProperties {
  user: TUser
  createdLink: ISharedLink
  linkType: "profile" | "document"
}

export const QRSection = (properties: QRSectionProperties) => {
  const { user, createdLink, linkType } = properties

  const generateLink = () => {
    if (linkType === "profile") {
      return generateProfileLink({
        firstName: user.firstName,
        lastName: user.lastName,
        walletAddress: createdLink.walletAddress,
        xmppId: walletToUsername(user.walletAddress) + CONFERENCEDOMAIN,
        linkToken: createdLink.token,
      })
    }
    if (linkType === "document") {
      return generateDocumentLink({
        linkToken: createdLink.token,
      })
    }
  }

  return (
    <>
      <QRCode
        size={226}
        style={{ height: "60vh", maxWidth: "100%", width: "100%" }}
        value={generateLink()}
        viewBox={`0 0 256 256`}
      />
      <Box
        sx={{
          boxShadow: "2px 0px 5px 0px rgba(0,0,0,0.75)",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pl: "10px",
          my: "10px",
        }}
      >
        <span>{truncateString(generateLink(), 50)}</span>
        <Button
          variant="contained"
          sx={{ borderRadius: "10px" }}
          onClick={() => navigator.clipboard.writeText(generateLink())}
        >
          Copy
        </Button>
      </Box>
    </>
  )
}
