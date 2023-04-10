import https from "https";
import axios from "axios";
import base64 from "base-64";

import config from "../config";

export async function registerXmppuser(
  walletAddress: string,
  password: string
) {
  //replace all caps in walletAddress with _ and respective lowercase letter
  let manipulatedWalletAddress = walletAddress
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase();

  const agent = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  let bodydata = {
    host: config.xmppHost,
    user: manipulatedWalletAddress,
    password: password,
  };

  const tokenXMPP = `Basic ${base64.encode(
    `${config.xmppAdmin}:${config.xmppPass}`
  )}`;

  let response = await agent.post(`${config.xmppPath}/register`, bodydata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenXMPP,
    },
  });

  return response.data;
}
