import { useState, useMemo, useCallback } from "react";
import { uiFactory } from "@/lib/factory";
import type { Platform } from "@/lib/types";

export function usePhonePreview() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "" });

  const kit = useMemo(() => uiFactory.create(platform), [platform]);

  const handleSubmit = useCallback(() => setModalOpen(true), []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setFormValues({ name: "", email: "" });
  }, []);

  const updateField = useCallback((field: "name" | "email", value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    platform,
    setPlatform,
    kit,
    modalOpen,
    formValues,
    updateField,
    handleSubmit,
    handleCloseModal,
  };
}
