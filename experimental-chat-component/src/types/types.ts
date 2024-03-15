export interface IUser {
  id: string | null;
  name: string | null;
  avatar?: string | null;
  xmmpPass?: string | null;
  userJID?: string | null;
}

export interface IMessage {
  id: string;
  user: IUser;
  date: Date | string;
  body: string;
  roomJID?: string;
  key?: string;
  coinsInMessage?: string;
  numberOfReplies?: number;
}

export interface IRoom {
  id: string;
  name: string;
  users: IUser[];
  messages: IMessage[];
}

export interface UserType extends IMessage {
  id: any;
  user: any;
  timestamp: any;
  text: any;
}
