export const createChatSlice = (set) => ({
  isConnected: false,
  setConnected: (isConnected) => set((state) => ({...state, isConnected: isConnected}))
})