import { Client, xml } from '@xmpp/client'
import { BOT_FIRSTNAME, BOT_LASTNAME, BOT_AVATAR } from './config.create'

import { Participant, Question, Message } from './types'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function reverseUnderScoreManipulation(str: string) {
  return str.replace(/_([a-z])/gm, (m1, m2) => {
    return m2.toUpperCase()
  })
}

export function underscoreManipulation(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export async function nextMessage(
  participant: Participant,
  questions: Question[],
  participants: { [key: string]: Participant },
  onEnd: (p: Participant, client: Client, walletAddress: string) => Promise<void>,
  client: Client,
  walletAddress: string
) {
  const nextQuestionIndex = participant.questionIndex + 1

  if (nextQuestionIndex >= questions.length) {
    console.log('the end')
    await onEnd(participant, client, walletAddress)
    delete participants[participant.id]
    return
  }
  participant.questionIndex = nextQuestionIndex
  const next = await questions[nextQuestionIndex].message(participant)

  if (next) {
    await sendMessage(participant, next, client, walletAddress)
  } else {
    await nextMessage(participant, questions, participants, onEnd, client, walletAddress)
  }
}

export async function repeatMessage(
  participant: Participant,
  questions: Question[],
  participants: { [key: string]: Participant },
  onEnd: (p: Participant, client: Client, walletAddress: string) => Promise<void>,
  client: Client,
  walletAddress: string
) {
  const nextQuestionIndex = participant.questionIndex

  const next = await questions[nextQuestionIndex].message(participant)

  if (next) {
    await sendMessage(participant, next, client, walletAddress, true)
  }
}

export async function sendMessage(p: Participant, message: Message, client: Client, walletAddress: string, repeat = false): Promise<void> {
  if (repeat === true) {
    for (const [index, msg] of message.messages.entries()) {
      await sleep(100)
      if (msg.repeat === true) {
        if (
          index === message.messages.length - 1 &&
          message.buttons &&
          message.buttons.length
        ) {
          const xmlMsg = xml(
            'message',
            {
              id: 'sendMessage',
              type: 'groupchat',
              from: client?.jid?.toString(),
              to: p.id.split('/')[0],
            },
            xml('body', {}, msg.data as string),
            xml('data', {
              xmlns: 'jabber:client',
              senderJID: client?.jid?.toString(),
              senderFirstName: BOT_FIRSTNAME,
              senderLastName: BOT_LASTNAME,
              senderWalletAddress: walletAddress,
              isSystemMessage: false,
              tokenAmount: 0,
              receiverMessageId: 0,
              mucname: '',
              photoURL: BOT_AVATAR,
              quickReplies: JSON.stringify(message.buttons),
            })
          )
          await client.send(xmlMsg)
          continue
        }
        if (msg.type == 'file') {
          const xmlMsg = xml(
            'message',
            {
              id: 'sendMessage',
              type: 'groupchat',
              from: client?.jid?.toString(),
              to: p.id.split('/')[0],
            },
            xml('body', {}, 'media file'),
            xml('data', {
              xmlns: 'jabber:client',
              senderJID: client?.jid?.toString(),
              senderFirstName: BOT_FIRSTNAME,
              senderLastName: BOT_LASTNAME,
              senderWalletAddress: walletAddress,
              isSystemMessage: false,
              tokenAmount: 0,
              receiverMessageId: 0,
              mucname: '',
              photoURL: BOT_AVATAR,
              ...msg.data,
            })
          )
          await client.send(xmlMsg)
        } else {
          const xmlMsg = xml(
            'message',
            {
              id: 'sendMessage',
              type: 'groupchat',
              from: client?.jid?.toString(),
              to: p.id.split('/')[0],
            },
            xml('body', {}, msg.data),
            xml('data', {
              xmlns: 'jabber:client',
              senderJID: client?.jid?.toString(),
              senderFirstName: BOT_FIRSTNAME,
              senderLastName: BOT_LASTNAME,
              senderWalletAddress: walletAddress,
              isSystemMessage: false,
              tokenAmount: 0,
              receiverMessageId: 0,
              mucname: '',
              photoURL: BOT_AVATAR,
            })
          )
    
          await client.send(xmlMsg)
        }
      } else {
        continue
      }
    }
  } else {
    for (const [index, msg] of message.messages.entries()) {
      await(sleep(100))
      if (
        index === message.messages.length - 1 &&
        message.buttons &&
        message.buttons.length
      ) {
        const xmlMsg = xml(
          'message',
          {
            id: 'sendMessage',
            type: 'groupchat',
            from: client?.jid?.toString(),
            to: p.id.split('/')[0],
          },
          xml('body', {}, msg.data as string),
          xml('data', {
            xmlns: 'jabber:client',
            senderJID: client?.jid?.toString(),
            senderFirstName: BOT_FIRSTNAME,
            senderLastName: BOT_LASTNAME,
            senderWalletAddress: walletAddress,
            isSystemMessage: false,
            tokenAmount: 0,
            receiverMessageId: 0,
            mucname: '',
            photoURL: BOT_AVATAR,
            quickReplies: JSON.stringify(message.buttons),
          })
        )
        await client.send(xmlMsg)
        continue
      }
      if (msg.type == 'file') {
        const xmlMsg = xml(
          'message',
          {
            id: 'sendMessage',
            type: 'groupchat',
            from: client?.jid?.toString(),
            to: p.id.split('/')[0],
          },
          xml('body', {}, 'media'),
          xml('data', {
            xmlns: 'jabber:client',
            senderJID: client?.jid?.toString(),
            senderFirstName: BOT_FIRSTNAME,
            senderLastName: BOT_LASTNAME,
            senderWalletAddress: walletAddress,
            isSystemMessage: false,
            tokenAmount: 0,
            receiverMessageId: 0,
            mucname: '',
            photoURL: BOT_AVATAR,
            ...msg.data,
          })
        )
        console.log('sending file ', xmlMsg.toString())
        await client.send(xmlMsg)
      } else {
        const xmlMsg = xml(
          'message',
          {
            id: 'sendMessage',
            type: 'groupchat',
            from: client?.jid?.toString(),
            to: p.id.split('/')[0],
          },
          xml('body', {}, msg.data),
          xml('data', {
            xmlns: 'jabber:client',
            senderJID: client?.jid?.toString(),
            senderFirstName: BOT_FIRSTNAME,
            senderLastName: BOT_LASTNAME,
            senderWalletAddress: walletAddress,
            isSystemMessage: false,
            tokenAmount: 0,
            receiverMessageId: 0,
            mucname: '',
            photoURL: BOT_AVATAR,
          })
        )
  
        await client.send(xmlMsg)
      }
    }
  }

}
