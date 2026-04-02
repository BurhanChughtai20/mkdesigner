export type StepField = {
  name: string;
  label: string;
  type: "text" | "number" | "url" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};
// Single source of truth for AI output shape.
// Import this wherever AIOutput is needed — never redefine it inline.
export type AIOutput = {
  campaignTitle: string;
  headlineOptions: string[];
  toneOfVoiceGuide: string;
  recommendedChannels: { channel: string; budgetAllocation: string }[];
  keyVisualDirection: string;
  executiveSummary: string;
  targetAudienceInsight: string;
  kpis: string[];
};