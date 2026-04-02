import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StepRenderer from "./StepRenderer";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import { formSchema } from "@/schema/formSchema";
import { generateCampaign } from "@/services/aiService";
import { savePDF } from "@/services/pdfService";
import type { FormInput, FormOutput } from "@/schema/formSchema";
import { useState } from "react";
import type { AIOutput } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CampaignFormDialog({ isOpen, onClose }: Props) {
  const { step, next, prev } = useCampaignForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleSubmit, control, watch } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      industry: "",
      website: "",
      competitors: "",
      objective: "Awareness",
      targetAudience: "",
      budget: 0,
      tone: "",
      imagery: "",
      colorDirection: "",
      dosAndDonts: "",
    },
  });

  const onSubmit = async (data: FormOutput) => {
    setLoading(true);
    setError(null);
    try {
      const result: AIOutput = await generateCampaign(data);
      savePDF(result, data.clientName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

 const formValues: FormOutput = watch() as FormOutput & { budget: number };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Campaign Builder —{" "}
            {step <= 4 ? `Step ${step} of 4` : "Complete"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
        <StepRenderer
  step={step}
  control={control}
  formValues={formValues}
/>

          {error && (
            <p className="text-red-500 text-sm mt-3 font-medium">
              Error: {error}
            </p>
          )}

          <DialogFooter className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prev}>
                Back
              </Button>
            )}

            {step < 4 && (
              <Button type="button" onClick={next}>
                Next
              </Button>
            )}

            {step === 4 && (
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Campaign"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}