import xmpp, { xml } from "@xmpp/client";

import { login } from "./api";
import {
  underscoreManipulation,
  reverseUnderScoreManipulation,
  nextMessage,
  repeatMessage,
} from "./utils";
import { questions, onEnd, onExit } from "./questions.create";
import { Participant } from "./types";
import {
  LEAVE_BOT_COMMANDS,
  PASSWORD,
  ROOMS,
  SERVICE,
  START_BOT_COMMANDS,
  USERNAME,
} from "./config.create";

const main = async () => {
  const loginResponse = await login(USERNAME, PASSWORD);

  if (!loginResponse) {
    throw new Error("Bad creads for login");
  }

  const {
    xmppPassword,
    defaultWallet: { walletAddress },
  } = loginResponse.user;
  const xmppUsername = underscoreManipulation(walletAddress);

  console.log({
    service: SERVICE,
    username: xmppUsername,
    password: xmppPassword,
  });
  const client = xmpp.client({
    service: SERVICE,
    username: xmppUsername,
    password: xmppPassword,
  });

  const participants: { [key: string]: Participant } = {};

  async function processParticipant(participant: Participant) {
    const { questionIndex } = participant;
    // on start
    if (questionIndex == -1) {
      await nextMessage(
        participant,
        questions,
        participants,
        onEnd,
        client,
        walletAddress
      );
    } else {
      if (participant.onExit) {
        if (participant.msg === "Yes, stop 🚫") {
          delete participants[participant.id];
          return;
        }

        if (participant.msg === "No, keep going ▶️") {
          participant["onExit"] = false;
          const currentQuestion = questions[questionIndex];

          if (currentQuestion.validateAnswer) {
            const isValid = await currentQuestion.validateAnswer(participant);

            if (isValid) {
              // next question
              participant.answers[currentQuestion.name] = participant.msg;
              await nextMessage(
                participant,
                questions,
                participants,
                onEnd,
                client,
                walletAddress
              );
              return;
            } else {
              await repeatMessage(
                participant,
                questions,
                participants,
                onEnd,
                client,
                walletAddress
              );
              return;
            }
          } else {
            participant.answers[currentQuestion.name] = participant.msg;
            await nextMessage(
              participant,
              questions,
              participants,
              onEnd,
              client,
              walletAddress
            );
            return;
          }
        }

        await onExit(participant, client, walletAddress);
        return;
      }
      if (LEAVE_BOT_COMMANDS.includes(participant.msg.toLocaleLowerCase())) {
        await onExit(participant, client, walletAddress);
        participant["onExit"] = true;
        return;
      }

      const currentQuestion = questions[questionIndex];

      if (currentQuestion.validateAnswer) {
        const isValid = await currentQuestion.validateAnswer(participant);

        if (isValid) {
          // next question
          participant.answers[currentQuestion.name] = participant.msg;

          if (currentQuestion.afterValidate) {
            await currentQuestion.afterValidate(
              participant,
              client,
              walletAddress
            );
          }

          await nextMessage(
            participant,
            questions,
            participants,
            onEnd,
            client,
            walletAddress
          );
        } else {
          await repeatMessage(
            participant,
            questions,
            participants,
            onEnd,
            client,
            walletAddress
          );
        }
      } else {
        participant.answers[currentQuestion.name] = participant.msg;
        await nextMessage(
          participant,
          questions,
          participants,
          onEnd,
          client,
          walletAddress
        );
      }
    }
  }

  client.on("stanza", async (stanza) => {
    console.log("on stanza ", stanza.toString());

    if (stanza.is("presence") && stanza.attrs.type === "subscribe") {
      client.send(
        xml("presence", { to: stanza.attrs.from, type: "subscribed" })
      );
    }
    if (stanza.is("message")) {
      const body = stanza.getChild("body");

      if (body) {
        const msgText = body.getText();
        console.log({ msgText });
        const participantId: string = stanza.attrs.from;
        const participant: Participant | null = participants[participantId];

        if (msgText) {
          if (participant) {
            participant.msg = msgText;
            participant.stanza = stanza;
            await processParticipant(participant);
          } else {
            if (START_BOT_COMMANDS.includes(msgText.toLocaleLowerCase())) {
              const data = stanza.getChild("data");

              if (data) {
                const newParticipant: Participant = {
                  id: participantId,
                  stanza: stanza,
                  msg: msgText,
                  firstName: data.attrs.senderFirstName,
                  lastName: data.attrs.senderLastName,
                  walletAddress: reverseUnderScoreManipulation(
                    stanza.attrs.from.split("/")[1]
                  ),
                  answers: {},
                  questionIndex: -1,
                };

                participants[participantId] = newParticipant;
                await processParticipant(newParticipant);
              }
            }
          }
        }
      }
    }
  });

  client.on("status", (...args) => console.log("on status ", args[0]));
  client.on("send", (...args) => console.log("on send ", args[0].toString()));
  client.on("online", (jid) => {
    ROOMS.forEach((room) => {
      const xmlMsg = xml(
        "presence",
        {
          from: jid.toString(),
          to: `${room}/${jid.getLocal()}`,
        },
        xml("x", "http://jabber.org/protocol/muc")
      );

      console.log("+++ +++ ", xmlMsg.toString());
      client.send(xmlMsg);
    });
  });
  client.on("error", (...args) => console.log("on error ", args));

  client.start();
};

main();
