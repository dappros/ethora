import { create } from 'zustand'
import { createUserSlice } from './createUserSlice'
import { createFishSlice } from './createFishSlice'

export const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createFishSlice(...a),
}))