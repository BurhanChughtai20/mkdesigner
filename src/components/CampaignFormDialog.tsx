import { useState, useCallback, useMemo, useRef } from "react";
import rawFormFieldsJson from "@/data/formFields.json";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jsPDF } from "jspdf";

/* ---------------- TYPES ---------------- */

type StepField = {
  name: string;
  label: string;
  type: "text" | "number" | "url" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};

type FormFieldsJson = {
  step1: StepField[];
  step2: StepField[];
  step3: StepField[];
};

type AIOutput = {
  campaignTitle: string;
  headlineOptions: string[];
  toneOfVoiceGuide: string;
  recommendedChannels: { channel: string; budgetAllocation: string }[];
  keyVisualDirection: string;
  executiveSummary: string;
  targetAudienceInsight: string;
  kpis: string[];
};

/* ---------------- SCHEMA ---------------- */

const formSchema = z.object({
  clientName: z.string().min(2),
  industry: z.string().min(2),
  website: z.string().url(),
  competitors: z.string().min(1),
  objective: z.enum(["Awareness", "Consideration", "Conversion"]),
  targetAudience: z.string().min(2),
  budget: z.coerce.number().min(1, "Budget must be at least 1"),
  tone: z.string().min(2),
  imagery: z.string().min(2),
  colorDirection: z.string().min(2),
  dosAndDonts: z.string().min(1),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const formFieldsJson = rawFormFieldsJson as FormFieldsJson;

/* ---------------- PDF GENERATOR ---------------- */

function buildPDF(data: AIOutput, clientName: string): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  const writeTitle = (text: string) => {
    checkPageBreak(12);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 10;
  };

  const writeHeading = (text: string) => {
    checkPageBreak(10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(text.toUpperCase(), margin, y);
    y += 6;
  };

  const writeBody = (text: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(String(text), maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 2;
  };

  // Header
  writeTitle(`Campaign Plan — ${clientName}`);
  y += 2;

  // Campaign Title
  writeHeading("Campaign Title");
  writeBody(data.campaignTitle);

  // Executive Summary
  writeHeading("Executive Summary");
  writeBody(data.executiveSummary);

  // Headline Options
  writeHeading("Headline Options");
  data.headlineOptions.forEach((h, i) => writeBody(`${i + 1}. ${h}`));

  // Tone of Voice
  writeHeading("Tone of Voice Guide");
  writeBody(data.toneOfVoiceGuide);

  // Target Audience Insight
  writeHeading("Target Audience Insight");
  writeBody(data.targetAudienceInsight);

  // Recommended Channels — FIX: was printing [object Object]
  writeHeading("Recommended Channels & Budget Allocation");
  data.recommendedChannels.forEach((ch) => {
    writeBody(`• ${ch.channel} — ${ch.budgetAllocation}`);
  });

  // Key Visual Direction
  writeHeading("Key Visual Direction");
  writeBody(data.keyVisualDirection);

  // KPIs
  writeHeading("KPIs");
  data.kpis.forEach((kpi) => writeBody(`• ${kpi}`));

  return doc;
}

function savePDF(data: AIOutput, clientName: string) {
  const doc = buildPDF(data, clientName);
  const fileName = `${clientName.replace(/\s+/g, "_")}_campaign.pdf`;
  doc.save(fileName);
}

/* ---------------- COMPONENT ---------------- */

export default function CampaignFormDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep clientName accessible for PDF re-export without re-reading the form
  const clientNameRef = useRef<string>("");

  const {
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      clientName: "",
      industry: "",
      website: "",
      competitors: "",
      objective: "Awareness",
      targetAudience: "",
      budget: undefined,
      tone: "",
      imagery: "",
      colorDirection: "",
      dosAndDonts: "",
    },
  });

  /* ---------------- HELPERS ---------------- */

  // FIX: guard against undefined when step >= 4
  const currentFields = useMemo<StepField[]>(() => {
    const key = `step${step}` as keyof FormFieldsJson;
    return formFieldsJson[key] ?? [];
  }, [step]);

  const nextStep = useCallback(async () => {
    // FIX: only trigger validation if there are fields on this step
    if (currentFields.length > 0) {
      const fieldNames = currentFields.map((f) => f.name as keyof FormInput);
      const valid = await trigger(fieldNames);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  }, [trigger, currentFields]);

  const prevStep = useCallback(() => setStep((s) => s - 1), []);

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = useCallback(async (data: FormOutput) => {
    setLoading(true);
    setError(null);
    clientNameRef.current = data.clientName;

    const prompt = `
You are a senior marketing strategist. Based on the campaign brief below, generate a structured creative direction document.

BRIEF:
- Client: ${data.clientName}
- Industry: ${data.industry}
- Website: ${data.website}
- Competitors: ${data.competitors}
- Objective: ${data.objective}
- Target Audience: ${data.targetAudience}
- Budget: $${data.budget}
- Tone: ${data.tone}
- Imagery Style: ${data.imagery}
- Color Direction: ${data.colorDirection}
- Do's & Don'ts: ${data.dosAndDonts}

Respond ONLY with a valid JSON object. No markdown, no explanation, no backticks.

JSON shape:
{
  "campaignTitle": "string",
  "headlineOptions": ["string", "string", "string"],
  "toneOfVoiceGuide": "string",
  "recommendedChannels": [
    { "channel": "string", "budgetAllocation": "string" }
  ],
  "keyVisualDirection": "string",
  "executiveSummary": "string",
  "targetAudienceInsight": "string",
  "kpis": ["string", "string", "string"]
}
`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: 2048, // FIX: 1000 cuts the JSON mid-response
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody?.error?.message ?? `HTTP ${res.status}`);
      }

      const raw = await res.json();

      const text = raw.content
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { type: string; text: string }) => b.text)
        .join("");

      const result = JSON.parse(text) as AIOutput;

      setAiOutput(result);
      setStep(5);

      // Auto-save on submit
      savePDF(result, data.clientName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- RENDER FIELD ---------------- */

  const renderField = useCallback(
    (field: StepField) => (
      <div key={field.name}>
        <Label className="mb-1">{field.label}</Label>
        <Controller
          name={field.name as keyof FormInput}
          control={control}
          render={({ field: ctrl }) => {
            const displayValue =
              ctrl.value !== undefined ? String(ctrl.value) : "";

            if (field.type === "textarea") {
              return (
                <Textarea
                  placeholder={field.placeholder}
                  value={displayValue}
                  onChange={(e) => ctrl.onChange(e.target.value)}
                />
              );
            }

            if (field.type === "select" && field.options) {
              return (
                <Select value={displayValue} onValueChange={ctrl.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }

            return (
              <Input
                placeholder={field.placeholder}
                type={field.type}
                value={displayValue}
                onChange={(e) => ctrl.onChange(e.target.value)}
              />
            );
          }}
        />
        {errors[field.name as keyof FormInput] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[field.name as keyof FormInput]?.message as string}
          </p>
        )}
      </div>
    ),
    [control, errors]
  );

  /* ---------------- RENDER STEP ---------------- */

  const renderStep = () => {
    const data = watch();

    // Step 4 — Review
    if (step === 4) {
      return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-lg">Review Your Campaign Brief</h3>
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex justify-between border p-2 rounded gap-4">
              <span className="font-medium capitalize shrink-0">
                {k.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-right text-sm text-gray-700">
                {v !== undefined && v !== "" ? String(v) : <em className="text-gray-400">Not provided</em>}
              </span>
            </div>
          ))}
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              Error: {error}
            </p>
          )}
        </div>
      );
    }

    // Step 5 — FIX: formatted output, not raw JSON. Re-export button included.
    if (step === 5 && aiOutput) {
      return (
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          <p className="text-green-600 font-semibold text-sm">
            ✓ Campaign generated — PDF saved automatically.
          </p>

          <Section title="Campaign Title">
            <p className="font-bold text-base">{aiOutput.campaignTitle}</p>
          </Section>

          <Section title="Executive Summary">
            <p className="text-sm text-gray-700">{aiOutput.executiveSummary}</p>
          </Section>

          <Section title="Headline Options">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {aiOutput.headlineOptions.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </Section>

          <Section title="Tone of Voice Guide">
            <p className="text-sm text-gray-700">{aiOutput.toneOfVoiceGuide}</p>
          </Section>

          <Section title="Target Audience Insight">
            <p className="text-sm text-gray-700">{aiOutput.targetAudienceInsight}</p>
          </Section>

          <Section title="Recommended Channels">
            <ul className="space-y-1 text-sm">
              {aiOutput.recommendedChannels.map((ch, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{ch.channel}</span>
                  <span className="font-medium">{ch.budgetAllocation}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Key Visual Direction">
            <p className="text-sm text-gray-700">{aiOutput.keyVisualDirection}</p>
          </Section>

          <Section title="KPIs">
            <ul className="list-disc list-inside space-y-1 text-sm">
              {aiOutput.kpis.map((kpi, i) => (
                <li key={i}>{kpi}</li>
              ))}
            </ul>
          </Section>
        </div>
      );
    }

    return <div className="space-y-4">{currentFields.map(renderField)}</div>;
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Campaign Builder —{" "}
            {step <= 4 ? `Step ${step} of 4` : "Complete"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>

        <DialogFooter className="flex justify-between">
          {step > 1 && step <= 4 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}

          {step < 4 && (
            <Button onClick={nextStep}>Next</Button>
          )}

          {step === 4 && (
            <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? "Generating..." : "Generate Campaign"}
            </Button>
          )}

          {/* FIX: re-export button on step 5 as task requires */}
          {step === 5 && aiOutput && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => savePDF(aiOutput, clientNameRef.current)}
              >
                Export PDF
              </Button>
              <Button onClick={onClose}>Done</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- SECTION HELPER ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded p-3 space-y-1">
      <h4 className="font-semibold text-xs uppercase tracking-wide text-gray-500">
        {title}
      </h4>
      {children}
    </div>
  );
}