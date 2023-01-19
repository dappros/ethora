import { Client } from "@xmpp/client";
import Web3 from "web3";
import { Message, Participant, Question } from "./types";
import { sendMessage } from "./utils";
import * as api from "./api";
import db from "./db";

export const questions: Question[] = [
  {
    name: "address",
    message: async (p) => {
      return {
        messages: [
          {
            type: "text",
            data:
              `OK, let me help with exporting your Coin to mainnet.\n` +
              `First, do you know which mainnet address we will be sending to?\n` +
              `Please paste the address below.`,
            repeat: true,
          },
        ],
      };
    },
    validateAnswer: async (p) => {
      if (Web3.utils.isAddress(p.msg)) {
        return true;
      }

      return false;
    },
    afterValidate: async (
      p: Participant,
      client: Client,
      walletAddress: string
    ) => {
      await sendMessage(
        p,
        {
          messages: [
            {
              type: "text",
              data:
                `OK, noted.\n` + `Checking the L1 contract, a minute please..`,
            },
          ],
        },
        client,
        walletAddress
      );
    },
  },
  {
    name: "_coins",
    message: async (p) => {
      let balance, error;
      try {
        const web3 = new Web3(process.env.EXTERNAL_BC_WS as string);
        const contractAddressUSDC = process.env.USDC_CONTRACT_ADDRESS as string;

        const usdcContract = await new web3.eth.Contract(
          [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
          contractAddressUSDC
        );

        balance = await usdcContract.methods
          .balanceOf(process.env.DAPPROS_PLATFORM_WALLET)
          .call();

        balance = web3.utils.fromWei(balance, "mwei");
      } catch (e) {
        error = e;
      }

      if (error) {
        return {
          messages: [
            {
              type: "text",
              data:
                `Apologies, I have a trouble reading the mainnet exchange contract.\n` +
                `This means I cannot assist you with this exchange at the moment.\n` +
                `Perhaps at a later time?`,
            },
          ],
        };
      } else {
        return {
          messages: [
            {
              type: "text",
              data:
                `All good, we can proceed.\n` +
                `Mainnet contract has ${balance} USDC available.\n` +
                `You will obtain USDC at the following rate:\n` +
                `1,000 Coin = 1 USDC\n` +
                `This will be send to your L1 address as specified before:\n` +
                `${p.answers["address"]}\n` +
                `To proceed, simply send me the amount of Coin you’d like to export.\n`,
            },
          ],
        };
      }
    },
    validateAnswer: async (p) => {
      let tokenAmount = Number(p.stanza.getChild("data")?.attrs.tokenAmount);
      let transactionId = p.stanza.getChild("data")?.attrs.transactionId;

      let tx = await db.Transaction.findOne({ where: { transactionId } });
      if (tx) {
        // TODO
      }

      const getTxResp = await api.getTransactionById(transactionId);
      const apiTxRecord = getTxResp.data.result;

      if (!apiTxRecord) {
        // TODO
      }

      // from: '0x1bD985A8B8d3B1aa170D114E32983d58Dca52609',
      // to: '0x032134D0bA7468B2849ECD38DB95329328A0fecE',
      // tokenName: 'Dappros Platform Token',
      // value: '5000000000000000000',
      // type: 'Transfer',
      // isCompleted: false,
      // timestamp: '2023-01-10T14:39:03.462Z',
      // senderFirstName: 'Borys',
      // senderLastName: 'Bordunov',
      // receiverFirstName: 'Exchange ',
      // receiverLastName: 'Bot',
      // senderBalance: '73083000000000000000000',
      // receiverBalance: '246000000000000000000',
      // createdAt: '2023-01-10T14:39:03.465Z',
      // updatedAt: '2023-01-10T14:39:03.465Z',

      // TODO check from & to
      // TODO check createdAd time +- 1 min
      // TODO transaction contract Address

      await db.Transaction.create({
        transactionId,
      });

      p.msg = Web3.utils.fromWei(apiTxRecord.value);

      return true;
    },
    afterValidate: async (
      p: Participant,
      client: Client,
      walletAddress: string
    ) => {
      let coins = p.msg;
      const usdcAmount = parseInt(coins) / 1000;

      await sendMessage(
        p,
        {
          messages: [
            {
              type: "text",
              data:
                `👌Thank you, I’m now proceeding with your transaction.\n` +
                `${usdcAmount} USDC are being sent to the address you have specified..`,
            },
          ],
        },
        client,
        walletAddress
      );
    },
  },
];

export async function onEnd(
  p: Participant,
  client: Client,
  walletAddress: string
) {
  // await
  const transferResult = await api.transferDapprosCoins(
    process.env.DAPPROS_PLATFORM_WALLET as string,
    p.answers["_coins"]
  );

  const transactionId = transferResult.data.transaction._id;

  let exportResp;
  try {
    exportResp = await api.exportToUsdc(transactionId, p.walletAddress);
  } catch (e) {
    console.log(e);
  }

  if (!exportResp) {
    // TODO - error while exporting
  }

  const transactionHash = exportResp?.data.transaction.transactionHash;
  const transactionUrl =
    (process.env.ETHERSCAN_URL as string) + `/tx/${transactionHash}`;

  await sendMessage(
    p,
    {
      messages: [
        {
          type: "text",
          data:
            `✅ All done - funds have been sent.\n` +
            `Transaction can be verified here:\n` +
            `${transactionUrl}\n` +
            `Thank you for your business and hope to see you soon again! Bye! 👋`,
        },
      ],
    },
    client,
    walletAddress
  );
}

export async function onExit(
  p: Participant,
  client: Client,
  walletAddress: string
) {
  await sendMessage(
    p,
    {
      messages: [
        {
          type: "text",
          data: `${p.firstName} ${p.lastName}, Would you like to stop the process?`,
        },
      ],
      buttons: [
        { name: "Yes, stop 🚫", value: "Yes, stop 🚫" },
        { name: "No, keep going ▶️", value: "No, keep going ▶️" },
      ],
    },
    client,
    walletAddress
  );
}
