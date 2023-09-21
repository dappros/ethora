export const createUserSlice = (set) => ({
  xmppUser: {
    username: '',
    password: ''
  },
  rooms: [],
  setXmppUser: (username, password) => set((state) => {
    state.xmppUser = { username, password }

    return {
      ...state
    }
  }),
  setRooms: (rooms) => set((state) => ({
    ...state,
    rooms
  })),
  addRoom: (room) => set((state) => {
    console.log("addRoom ", room)
    return {
      ...state,
      rooms: [...state.rooms, room]
    }
  })
})