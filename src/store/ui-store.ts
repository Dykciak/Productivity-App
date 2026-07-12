import { create } from "zustand";

interface UIState {
  isInboxOpen: boolean;
  openInbox: () => void;
  closeInbox: () => void;
  toggleInbox: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isInboxOpen: false,
  openInbox: () => set({ isInboxOpen: true }),
  closeInbox: () => set({ isInboxOpen: false }),
  toggleInbox: () => set((s) => ({ isInboxOpen: !s.isInboxOpen })),
}));
