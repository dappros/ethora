import { create } from 'zustand'
import { createUserSlice } from './createUserSlice'
import { createFishSlice } from './createFishSlice'
import {createChatSlice} from './createChatSlice'

export const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createFishSlice(...a),
  ...createChatSlice(...a)
}))

window.useStore = useStore