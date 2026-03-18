import { X } from "lucide-react";
import type { ModalStyle } from "@/lib/types";

export function ConfirmModal({ name, modalStyle, fontFamily, onClose }: {
  name: string;
  modalStyle: ModalStyle;
  fontFamily: string;
  onClose: () => void;
}) {
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center ${modalStyle.backdrop}`}>
      <div className={modalStyle.panel} style={{ fontFamily }}>
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
        <div className={modalStyle.title}>Account Created</div>
        <div className={modalStyle.message}>
          Welcome{name ? `, ${name}` : ""}. Your account is ready.
        </div>
        <div className="px-4 pb-4">
          <button onClick={onClose} className={`w-full ${modalStyle.button}`}>OK</button>
        </div>
      </div>
    </div>
  );
}
