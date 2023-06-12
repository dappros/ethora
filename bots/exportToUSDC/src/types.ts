import { Element } from "ltx";
import { Client } from "@xmpp/client";

export type Participant = {
  id: string;
  stanza: Element;
  msg: string;
  firstName: string;
  lastName: string;
  walletAddress: string;
  answers: {
    [key: string]: string;
  };
  questionIndex: number;
  onExit?: boolean;
};
export type TextMessage = {
  type: "text";
  data: string;
  repeat?: boolean;
};

export type FileMessage = {
  type: "file";
  data: {
    isVisible: boolean;
    mimetype: string;
    location: string;
    locationPreview: string;
    contractAddress: string;
    nftId: string;
    attachmentId: string;
  };
  repeat?: boolean;
};
export type Message = {
  messages: (TextMessage | FileMessage)[];
  buttons?: Button[];
  repeat?: boolean;
};

export type Question = {
  name: string;
  validateAnswer?: (p: Participant) => Promise<boolean>;
  message: (p: Participant) => Promise<Message | null>;
  afterValidate?: (
    p: Participant,
    client: Client,
    walletAddress: string
  ) => Promise<any>;
};

export type Button = {
  name: string;
  value: string;
};
