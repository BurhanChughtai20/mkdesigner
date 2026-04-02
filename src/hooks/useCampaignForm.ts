import { useState } from "react";

export function useCampaignForm() {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  return { step, next, prev };
}