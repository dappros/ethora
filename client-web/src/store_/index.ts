import create from "zustand";
import { XmppSliceInterface, createXmppSlice } from "./xmpp";

export const useZusttandStore = create<XmppSliceInterface>()((...a) => ({
  ...createXmppSlice(...a)
}))

declare global {
  interface Window {
  useZusttandStore?: any;
  }
  }

window.useZusttandStore = useZusttandStore
