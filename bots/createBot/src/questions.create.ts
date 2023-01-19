import { Client } from '@xmpp/client'
import Web3 from 'web3'
import { Message, Participant, Question } from './types'
import { sendMessage } from './utils'
import * as api from './api'

export const questions: Question[] = [
  {
    name: 'artId',
    message: async (p) => {
      return {
        messages: [
          {
            type: 'text',
            data: `Hi ${p.firstName} ${p.lastName}, I’m the Create Bot. I help people create digital collectibles (NFT’s). You will need a digital asset (image, video or sound) and 3 Coins to create your own collection.`,
          },
          {
            type: 'text',
            data: 'Just so that you know, I will use “NFmT Standard” template for your collection set up.',
          },
          {
            type: 'text',
            data: 'This means in your collection you will have:',
          },
          {
            type: 'text',
            data:
              '1) 25 x Paper NFTs: free,' +
              '\n' +
              '2) 50 x Copper: 100 Coin ($0.1) each,' +
              '\n' +
              '3) 100 x Steel: 1,000 ($1) each,' +
              '\n' +
              '4) 10 x Silver: 50,000 ($50) each,' +
              '\n' +
              '5) 3 x Gold: 150,000 ($150) each,' +
              '\n' +
              '6) 1 x Diamond: 1,000,000 ($1,000) each, with a total minted value of 189 NFTs and $2,055.',
          },
          {
            type: 'text',
            data: 'Any User will be able to purchase NFTs directly from this Collection.',
          },
          {
            type: 'text',
            data: 'Tip: you can type ‘exit’ or ’stop’ any time before we finish the mint in case if you change your mind.',
          },
          {
            type: 'text',
            data: 'To proceed, please send your art. JPG and PNG images are supported. (Hint: use paperclip icon bottom left.)',
            repeat: true,
          },
        ],
      }
    },
    validateAnswer: async (p) => {
      const data = p.stanza.getChild('data')

      const attachmentId = data?.attrs.attachmentId
      const mimetype = data?.attrs.mimetype

      console.log('attachmentId ', attachmentId)
      console.log('mimetype ', mimetype)

      const isValid = ['image/jpeg', 'image/png'].some((el) => el === mimetype)

      if (isValid) {
        p.msg = attachmentId
      }

      return isValid
    },
  },
  {
    name: 'collectionName',
    message: async (p) => {
      return {
        messages: [
          {
            type: 'text',
            data: `${p.firstName} ${p.lastName}, please enter a name for your Items collection.`,
            repeat: true,
          },
          {
            type: 'text',
            data: 'It should contain from 3 to 20 characters',
            repeat: true,
          },
        ],
      }
    },
    validateAnswer: async (p) => p.msg.length >= 3 && p.msg.length <= 20,
  },
  {
    name: 'collectionDescription',
    message: async (p) => {
      return {
        messages: [
          {
            type: 'text',
            data: `${p.firstName} ${p.lastName}. Noted, the name will be "${p.answers['collectionName']}"`,
          },
          {
            type: 'text',
            data: 'Please enter a description for your Items collection. It should contain from 10 to 512 characters',
            repeat: true,
          },
        ],
      }
    },
    validateAnswer: async (p) => p.msg.length >= 10 && p.msg.length < 513,
  },
  {
    name: 'benPercent',
    message: async (p) => {
      return {
        messages: [
          {
            type: 'text',
            data: `Sales proceeds will go to you by default. In case you wanted to add another beneficiary, please specify how much of the proceeds they should receive:`,
            repeat: true,
          },
        ],
        buttons: [
          { name: 'Share 100%', value: 'Share 100%' },
          { name: 'Share 90%', value: 'Share 90%' },
          { name: 'Share 50%', value: 'Share 50%' },
          { name: 'Share 10%', value: 'Share 10%' },
          {
            name: 'Not at the moment - skip this step',
            value: 'Not at the moment - skip this step',
          },
        ],
      }
    },
    validateAnswer: async (p) => {
      const isValid = [
        'Share 100%',
        'Share 90%',
        'Share 50%',
        'Share 10%',
        'Not at the moment - skip this step',
      ].some((el) => p.msg === el)
      return isValid
    },
  },
  {
    name: 'benAddress',
    message: async (p) => {
      if (p.answers['benPercent'] === 'Not at the moment - skip this step') {
        return null
      }

      const persents = {
        'Share 100%': '100%',
        'Share 90%': '90%',
        'Share 50%': '50%',
        'Share 10%': '10%',
      }

      type t = keyof typeof persents

      const percent = persents[p.answers['benPercent'] as t]

      return {
        messages: [
          {
            type: 'text',
            data: `Please enter an address for your beneficiary that will receive ${percent} of sales proceeds from this collection.`,
            repeat: true,
          },
        ],
      }
    },
    validateAnswer: async (p) => {
      if (Web3.utils.isAddress(p.msg)) {
        return true
      }

      return false
    },
  },
  {
    name: 'getCoins',
    message: async (p) => {
      const coins = 3
      return {
        messages: [
          {
            type: 'text',
            data: `Now, simply send me 3 Coins (hint: long tap on my message) to mint your NFT collection.`,
          },
        ],
      }
    },
    validateAnswer: async (p) => {
      const requiredCoins = 3
      let tokenAmount = Number(p.stanza.getChild('data')?.attrs.tokenAmount)
      tokenAmount = Number.isInteger(tokenAmount) ? tokenAmount : 0

      return Number(tokenAmount) === requiredCoins
    },
  },
]

export async function onEnd(
  p: Participant,
  client: Client,
  walletAddress: string
) {
  await sendMessage(
    p,
    {
      messages: [
        {
          type: 'text',
          data: 'Righty-ho, I’m minting 🛠️ your collection smart contract 📜 on chain 🔗 as we speak, you can leave this with me now.',
        },
      ],
    },
    client,
    walletAddress
  )

  try {
    const { collectionName, collectionDescription, artId } = p.answers

    const type = 'light'
    const name = collectionName
    const description = collectionDescription
    const owner = p.walletAddress
    const maxSupplies = [25, 50, 100, 10, 3, 1]
    // let beneficiaries = [p.walletAddress]
    let beneficiaries: string[] = []

    let splitPercents: number[] = []

    switch (p.answers['benPercent']) {
      case 'Share 100%':
        beneficiaries.push(p.answers['benAddress'])
        splitPercents.push(1000)
        break
      case 'Share 90%':
        beneficiaries = [p.walletAddress, p.answers['benAddress']]
        splitPercents = [100, 900]
        break
      case 'Share 50%':
        beneficiaries = [p.walletAddress, p.answers['benAddress']]
        splitPercents = [500, 500]
        break
      case 'Share 10%':
        beneficiaries = [p.walletAddress, p.answers['benAddress']]
        splitPercents = [900, 100]
        break
      case 'Not at the moment - skip this step':
        beneficiaries = [p.walletAddress]
        splitPercents = [1000]
        break
    }

    const costs = [
      '0',
      Web3.utils.toWei('100'),
      Web3.utils.toWei('1000'),
      Web3.utils.toWei('50000'),
      Web3.utils.toWei('150000'),
      Web3.utils.toWei('1000000'),
    ]
    const attachmentId = artId

    console.log('deploy args ', {
      type,
      name,
      description,
      owner,
      beneficiaries,
      splitPercents,
      costs,
      attachmentId,
      maxSupplies,
    })

    const deployResp = await api.deployNfmt(
      type,
      name,
      description,
      owner,
      beneficiaries,
      splitPercents,
      costs,
      attachmentId,
      maxSupplies
    )

    await sendMessage(
      p,
      {
        messages: [
          {
            type: 'text',
            data: `Awesome and congrats 😎🍸! Your NFT collection has been minted.`,
          },
          {
            type: 'text',
            data: 'It should be accessible in your profile under “Collections” tab now. Anybody can purchase NFTs first come - first served, starting now!',
          },
          {
            type: 'text',
            data: 'Good bye 👋 and looking forward to be working with you again!',
          },
          {
            type: 'text',
            data: p.answers['collectionName'],
          },
        ],
      },
      client,
      walletAddress
    )
    await sendMessage(
      p,
      {
        messages: [
          {
            type: 'file',
            data: {
              isVisible: true,
              mimetype: deployResp?.token?.nftMimetype,
              location: deployResp?.token?.nftFileUrl,
              locationPreview: deployResp.token.nftPreview,
              contractAddress: deployResp.token.contractAddress,
              nftId: deployResp.token._id,
              attachmentId: attachmentId,
            },
          },
        ],
      },
      client,
      walletAddress
    )
  } catch (e) {
    console.log(e)
  }
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
          type: 'text',
          data: `${p.firstName} ${p.lastName}, Would you like to stop the process?`,
        },
      ],
      buttons: [
        { name: 'Yes, stop 🚫', value: 'Yes, stop 🚫' },
        { name: 'No, keep going ▶️', value: 'No, keep going ▶️' },
      ],
    },
    client,
    walletAddress
  )
}
