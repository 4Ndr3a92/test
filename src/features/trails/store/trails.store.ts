import { create } from 'zustand'

type AppState = {
  selectedTrail?: string
  setSelectedTrail: (
    id: string,
  ) => void
}

export const useAppStore =
  create<AppState>((set) => ({
    selectedTrail: undefined,

    setSelectedTrail: (id) =>
      set({
        selectedTrail: id,
      }),
  }))