interface BanSystemMessageProps {
  senderName: string
  name: string
}

export const banSystemMessage = (data: BanSystemMessageProps) => {
  return [
    {
      _id: 1,
      text: `${data.senderName} removed by ${data.name}`,
      createdAt: new Date(),
      system: true,
    },
  ]
}
