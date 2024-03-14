export interface IUser {
  id: string;
  name: string;
  avatar: string;
}

export interface IMessage {
  id: string;
  user: IUser;
  timestamp: Date | string;
  text: string;
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
