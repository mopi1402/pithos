import { ChevronLeft } from "lucide-react";
import { usePhonePreview } from "@/hooks/usePhonePreview";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { ConfirmModal } from "./ConfirmModal";

export function PhonePreview() {
  const { platform, setPlatform, kit, modalOpen, formValues, updateField, handleSubmit, handleCloseModal } = usePhonePreview();

  const theme = kit.theme();
  const buttonStyle = kit.button();
  const inputStyle = kit.input();
  const navStyle = kit.nav();
  const modalStyle = kit.modal();

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="demo-header shrink-0 px-4 py-2.5 bg-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Cross-platform UI Kit</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">
              1 factory call, 3 skins : <code className="text-slate-300">createAbstractFactory()</code>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-6 p-4">
        <PlatformSwitcher platform={platform} onChange={setPlatform} />

        {/* Phone frame */}
        <div className="phone-frame overflow-hidden relative flex flex-col" style={{ background: theme.bg, fontFamily: theme.fontFamily }}>
          {/* Status bar */}
          <div className="shrink-0 h-12 flex items-end justify-between px-6" style={{ paddingBottom: "1rem", background: navStyle.statusBar }}>
            <span className="text-[12px] font-semibold text-black">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2.5 border border-black/80 rounded-sm relative">
                <div className="absolute inset-0.5 bg-black/80 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Nav bar */}
          <div className="shrink-0 platform-transition" style={{ background: theme.cardBg }}>
            <div className={navStyle.container}>
              <button className={navStyle.backButton}><ChevronLeft className="w-5 h-5" /></button>
              <span className={navStyle.title}>Sign Up</span>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 platform-transition">
            <div className="space-y-4">
              <FormField label="Full Name" placeholder="John Doe" value={formValues.name} onChange={(v) => updateField("name", v)} inputStyle={inputStyle} accent={theme.accent} />
              <FormField label="Email" placeholder="john@example.com" type="email" value={formValues.email} onChange={(v) => updateField("email", v)} inputStyle={inputStyle} accent={theme.accent} />
              <FormField label="Password" placeholder="••••••••" type="password" inputStyle={inputStyle} accent={theme.accent} />
              <div className="pt-2">
                <button onClick={handleSubmit} className={`w-full transition-all duration-400 ${buttonStyle.container} ${buttonStyle.text}`} style={{ borderRadius: buttonStyle.radius }}>
                  Create Account
                </button>
              </div>
              <button className={`w-full transition-all duration-400 ${buttonStyle.secondaryContainer} ${buttonStyle.secondaryText}`} style={{ borderRadius: buttonStyle.radius }}>
                Already have an account?
              </button>
            </div>
          </div>

          {modalOpen && <ConfirmModal name={formValues.name} modalStyle={modalStyle} fontFamily={theme.fontFamily} onClose={handleCloseModal} />}
        </div>

        {/* Code hint */}
        <div className="text-center hidden md:block">
          <code className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
            factory.create("<span style={{ color: theme.accent }}>{platform}</span>") → button, input, modal, nav
          </code>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = "text", value, onChange, inputStyle, accent }: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  inputStyle: { container: string; text: string; radius: string };
  accent: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-wider mb-1.5" style={{ color: accent }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full outline-none transition-all duration-400 ${inputStyle.container} ${inputStyle.text}`}
        style={{ borderRadius: inputStyle.radius }}
      />
    </div>
  );
}
