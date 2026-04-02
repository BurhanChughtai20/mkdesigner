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

const formFieldsJson: FormFieldsJson = rawFormFieldsJson as FormFieldsJson;

const formSchema = z.object({
  clientName: z.string().min(2, "Client Name is required"),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Website must be a valid URL"),
  competitors: z.string().min(1, "Competitors are required"),
  objective: z.enum(["Awareness", "Consideration", "Conversion"]),
  targetAudience: z.string().min(2, "Target Audience is required"),
  budget: z
    .number()
    .min(1, "Budget must be greater than 0")
    .refine((val) => !isNaN(val), "Budget must be a valid number"),
  tone: z.string().min(2, "Tone is required"),
  imagery: z.string().min(2, "Imagery style is required"),
  colorDirection: z.string().min(2, "Color direction is required"),
  dosAndDonts: z.string().min(1, "Please provide guidance"),
});


type FormData = z.infer<typeof formSchema>;

const isSelectField = (field: StepField): field is StepField & { options: string[] } =>
  field.type === "select" && Array.isArray(field.options);

interface CampaignFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignFormDialog({ isOpen, onClose }: CampaignFormDialogProps) {
  const [step, setStep] = useState(1);
  const [aiOutput, setAiOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { objective: "Awareness" },
  });

  const currentStepFields = useMemo(() => formFieldsJson[`step${step}` as keyof FormFieldsJson], [step]);

  const nextStep = useCallback(async () => {
    const valid = await trigger(currentStepFields.map((f) => f.name as keyof FormData));
    if (valid) setStep((prev) => prev + 1);
  }, [trigger, currentStepFields]);

  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true);
      try {
        const response = await fetch("/api/ai-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result: Record<string, unknown> = await response.json();
        setAiOutput(result);
        setStep(5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const exportPDF = useCallback(() => {
    if (!aiOutput) return;
    const doc = new jsPDF();
    doc.text(JSON.stringify(aiOutput, null, 2), 10, 10);
    doc.save("campaign.pdf");
  }, [aiOutput]);

  const renderStep = useCallback(() => {
    const data = watch();

    if (step === 4) {
      return (
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hidden">
          <h3 className="font-bold text-xl mb-2">Review Your Inputs</h3>
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="p-3 border rounded-lg shadow-md bg-gray-50 dark:bg-zinc-900 flex justify-between items-center hover:scale-[1.01] transition-transform"
            >
              <div className="font-semibold text-gray-700 dark:text-gray-200">{key}</div>
              <div className="text-gray-900 dark:text-gray-100">{value ?? <em>Not Provided</em>}</div>
            </div>
          ))}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            If any information is incorrect, use the "Back" button to edit.
          </p>
        </div>
      );
    }

    if (step === 5 && aiOutput) {
      return (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">AI Campaign Suggestions</h3>
          <pre className="bg-gray-100 dark:bg-zinc-800 p-4 rounded scrollbar-hidden">
            {JSON.stringify(aiOutput, null, 2)}
          </pre>
          <Button onClick={exportPDF}>Export as PDF</Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentStepFields.map((field) => (
          <div key={field.name}>
            <Label className="mb-1">{field.label}</Label>
            <Controller
              name={field.name as keyof FormData}
              control={control}
              render={({ field: { value, onChange } }) => {
                if (field.type === "textarea") {
                  return <Textarea placeholder={field.placeholder} value={value as string} onChange={(e) => onChange(e.target.value)} className="input-3d" />;
                }

                if (isSelectField(field)) {
                  return (
                    <Select value={(value as string) ?? "Awareness"} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                return (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={value !== undefined ? String(value) : ""}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="input-3d"
                  />
                );
              }}
            />
            {errors[field.name as keyof FormData] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name as keyof FormData]?.message}</p>
            )}
          </div>
        ))}
      </div>
    );
  }, [step, aiOutput, currentStepFields, control, errors, watch, exportPDF]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Campaign Brief Builder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>

        <DialogFooter className="flex justify-between mt-4">
          {step > 1 && step <= 4 && <Button variant="outline" onClick={prevStep}>Back</Button>}
          {step < 4 && <Button onClick={nextStep}>Next</Button>}
          {step === 4 && (
            <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </Button>
          )}
          {step === 5 && <Button onClick={onClose}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
