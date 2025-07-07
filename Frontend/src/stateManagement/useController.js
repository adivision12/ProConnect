import { create } from 'zustand'

const useController = create((set) => ({
  selected: null,
  setSelected: (selected) => set({selected}),
}))

export default useController;