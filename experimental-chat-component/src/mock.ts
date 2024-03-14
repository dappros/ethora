import { IUser, IMessage, IRoom } from "./types/types";

export const users: IUser[] = [
  { id: "1", name: "John Doe", avatar: "url_to_avatar" },
  { id: "2", name: "Roman Lesk", avatar: "url_to_avatar" },
];

export const messages: any[] = [
  {
    id: "1",
    user: users[0],
    timestamp: new Date().toISOString(),
    text: "Hello World",
  },
];

export const badMessages: any[] = [
  {
    id: "1",
    text: "Hello World",
    avatar: null,
    chainId: 123,
  },
  {
    id: "2",
    text: "Hello World",
    avatar: null,
    chainId: 123,
  },
];

export const goodMessages: any[] = [
  {
    id: "1",
    user: users[0],
    timestamp: new Date().toISOString(),
    text: "Hello World",
    avatar: null,
    chainId: 123,
  },
  {
    id: "2",
    user: users[1],
    timestamp: new Date().toISOString(),
    text: "Hello World",
    avatar: null,
    chainId: 123,
  },
];

export const rooms: IRoom[] = [{ id: "1", name: "General", users, messages }];
