import { create } from "zustand"

import { XmppSliceInterface, createXmppSlice } from "./xmpp";
import { ApplicationSliceInterface, createApplicationSlice } from "./application"
import { UserSliceInterface, createUserSlice } from "./user"

export const useZustandStore = create<XmppSliceInterface & ApplicationSliceInterface & UserSliceInterface>()((...a) => ({
  ...createXmppSlice(...a),
  ...createApplicationSlice(...a),
  ...createUserSlice(...a)
}))

declare global {
  interface Window {
    useZustandStore?: any;
  }
}

window.useZustandStore = useZustandStore
