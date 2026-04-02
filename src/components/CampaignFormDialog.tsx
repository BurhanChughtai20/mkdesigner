"use client";

import { useState, useCallback, useMemo } from "react";
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

type FormInput  = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const formFieldsJson = rawFormFieldsJson as FormFieldsJson;

/* ---------------- COMPONENT ---------------- */

export default function CampaignFormDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [aiOutput, setAiOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

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

  const currentFields = useMemo(
    () => formFieldsJson[`step${step}` as keyof FormFieldsJson],
    [step]
  );

  const nextStep = useCallback(async () => {
    const fieldNames = currentFields.map((f) => f.name as keyof FormInput);
    const valid = await trigger(fieldNames);
    if (valid) setStep((s) => s + 1);
  }, [trigger, currentFields]);

  const prevStep = useCallback(() => setStep((s) => s - 1), []);

  /* ---------------- SUBMIT ---------------- */

  // onSubmit now correctly receives FormOutput — budget is `number` here
  const onSubmit = useCallback(async (data: FormOutput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setAiOutput(result);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- PDF ---------------- */

  const exportPDF = useCallback(() => {
    if (!aiOutput) return;
    const doc = new jsPDF();
    doc.text(JSON.stringify(aiOutput, null, 2), 10, 10);
    doc.save("campaign.pdf");
  }, [aiOutput]);

  /* ---------------- RENDER FIELD ---------------- */

  const renderField = useCallback(
    (field: StepField) => (
      <div key={field.name}>
        <Label className="mb-1">{field.label}</Label>

        <Controller
          name={field.name as keyof FormInput}
          control={control}
          render={({ field: ctrl }) => {
            // String() cast is safe here — FormInput fields are strings or unknown,
            // and the HTML just needs a string to display.
            const displayValue = ctrl.value !== undefined ? String(ctrl.value) : "";

            if (field.type === "textarea") {
              return (
                <Textarea
                  placeholder={field.placeholder}
                  className="input-3d"
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
                className="input-3d"
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

  /* ---------------- RENDER ---------------- */

  const renderStep = () => {
    const data = watch();

    if (step === 4) {
      return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-lg">Review</h3>
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex justify-between border p-2 rounded">
              <span className="font-medium">{k}</span>
              <span>{v !== undefined ? String(v) : <em>Not provided</em>}</span>
            </div>
          ))}
        </div>
      );
    }

    if (step === 5 && aiOutput) {
      return (
        <div className="space-y-4">
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(aiOutput, null, 2)}
          </pre>
          <Button onClick={exportPDF}>Export PDF</Button>
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
          <DialogTitle>Campaign Builder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
        </form>

        <DialogFooter className="flex justify-between">
          {step > 1 && step <= 4 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          {step < 4 && <Button onClick={nextStep}>Next</Button>}
          {step === 4 && (
            <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </Button>
          )}
          {step === 5 && <Button onClick={onClose}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}