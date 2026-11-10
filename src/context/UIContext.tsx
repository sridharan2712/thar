import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info";
export type ModalName = "book" | "login" | "configure" | null;

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface UIState {
  toasts: Toast[];
  modal: ModalName;
  showToast: (message: string, type?: ToastType) => void;
  openModal: (name: ModalName) => void;
  closeModal: () => void;
}

const UIContext = createContext<UIState | null>(null);

let nextId = 0;

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalName>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const openModal = useCallback((name: ModalName) => setModal(name), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <UIContext.Provider value={{ toasts, modal, showToast, openModal, closeModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}